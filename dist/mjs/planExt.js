import { EnumMap, traverse } from './jsUtils.js';
import util from 'node:util';
const start = Symbol('start');
const end = Symbol('end');
const type = new EnumMap(['OPEN_ARRAY', 'CLOSE_ARRAY', 'NODE', 'UNSYNC']);
class Node {
    constructor(node, path, name) {
        this.node = node;
        this.path = [...path];
        this.name = name;
    }
    [util.inspect.custom]() {
        return `typeof node: ${typeof this.node}, path: ${this.path.join('.')} name: ${this.name}`;
    }
}
class Nodes {
    constructor() {
        this.nodes = [];
    }
    add(node, path) {
        const name = this.calculateNodeName(node, path);
        if (this.findByName(name))
            throw new Error(`Node with name ${name} already exists`);
        const newNode = new Node(node, path, name);
        this.nodes.push(newNode);
        return newNode;
    }
    findByName(name) {
        return this.nodes.find(node => node.name === name);
    }
    calculateNodeName(node, path) {
        let name = '';
        if (node.name) {
            name = node.name;
        }
        if (typeof node === 'symbol') {
            name = node.toString().replace('(', '_').replace(')', '');
        }
        if (this.findByName(name))
            return `${name}__${path.join('_')}`;
        return name;
    }
    getNodes() {
        return this.nodes;
    }
}
class Word {
    constructor(type, starts, ends, relations) {
        this.type = type;
        this.starts = starts;
        this.ends = ends;
        this.relations = relations;
    }
    [util.inspect.custom]() {
        return JSON.stringify(this);
    }
    toString() {
        JSON.stringify(this);
    }
    setType(type) {
        this.type = type;
        return this;
    }
    getRelations() {
        return this.relations;
    }
    sync(word) {
        for (const start of this.ends) {
            for (const end of word.starts) {
                if (start !== end)
                    this.relations.push([start, end]);
            }
        }
        return new Word(type.NODE, this.starts, word.ends, [...this.relations, ...word.relations,]);
    }
    static unsync(word1, word2) {
        return new Word(type.UNSYNC, [...word1.starts, ...word2.starts], [...word1.ends, ...word2.ends], [...word1.relations, ...word2.relations]);
    }
}
function planToTranscript(plan) {
    const nodes = new Nodes();
    const startNode = nodes.add(start, []);
    const transcript = []; //[new Word(type.NODE, [startNode], [startNode], [])]
    processPlan(plan, []);
    function processPlan(plan, path) {
        const pathLevel = path.length;
        for (let i = 0, j = 0; i < plan.length; i++) {
            if (Array.isArray(plan[i])) {
                transcript.push(new Word(type.OPEN_ARRAY));
                path.push(i);
                processPlan(plan[i], path);
                path.pop();
                transcript.push(new Word(type.CLOSE_ARRAY));
            }
            else {
                // path[pathLevel] = i
                path.push(i);
                nodes.add(plan[i], path);
                path.pop();
                const currentNode = nodes.getNodes().at(-1);
                transcript.push(new Word(type.NODE, [currentNode], [currentNode], []));
            }
        }
    }
    const endNode = nodes.add(end, []);
    const transcriptWithStartAndEnd = [
        new Word(type.NODE, [startNode], [startNode], []),
        ...transcript,
        new Word(type.NODE, [endNode], [endNode], [])
    ];
    return { transcript: transcriptWithStartAndEnd, nodes };
}
function compilePrecedenceFirst(transcript) {
    let previousTranscriptLength = transcript.length;
    while (transcript.length > 1) {
        // console.log('Before transccompilePrecedenceFirst: ', transcript.length)
        for (let i = 0; transcript[i + 1] !== undefined; i++) { // i < transcript.length - 1
            if (transcript[i].type === type.NODE &&
                transcript[i + 1].type === type.NODE) {
                transcript.splice(i, 2, transcript[i].sync(transcript[i + 1]));
            }
            if (transcript[i].type === type.UNSYNC &&
                transcript[i + 1].type === type.UNSYNC) {
                transcript.splice(i, 2, Word.unsync(transcript[i], transcript[i + 1]));
            }
            if (transcript[i]?.type === type.OPEN_ARRAY &&
                (transcript[i + 1]?.type === type.NODE || transcript[i + 1]?.type === type.UNSYNC) &&
                transcript[i + 2]?.type === type.CLOSE_ARRAY) {
                transcript.splice(i, 3, transcript[i + 1].setType(type.UNSYNC));
            }
            if (transcript[i]?.type === type.OPEN_ARRAY &&
                ((transcript[i + 1]?.type === type.NODE && transcript[i + 2]?.type === type.UNSYNC) ||
                    (transcript[i + 1]?.type === type.UNSYNC && transcript[i + 2]?.type === type.NODE)) &&
                transcript[i + 3]?.type === type.CLOSE_ARRAY) {
                transcript.splice(i, 4, transcript[i + 1].sync(transcript[i + 2]).setType(type.UNSYNC));
            }
            if (transcript[i]?.type === type.OPEN_ARRAY &&
                transcript[i + 1]?.type === type.UNSYNC &&
                transcript[i + 2]?.type === type.NODE) {
                transcript.splice(i + 1, 2, transcript[i + 1].sync(transcript[i + 2]));
            }
            if (transcript[i]?.type === type.NODE &&
                transcript[i + 1]?.type === type.UNSYNC &&
                transcript[i + 2]?.type === type.NODE) {
                transcript.splice(i, 3, transcript[i].sync(transcript[i + 1]).sync(transcript[i + 2]));
            }
            if (transcript[i]?.type === type.NODE &&
                transcript[i + 1]?.type === type.UNSYNC &&
                transcript[i + 2]?.type === type.CLOSE_ARRAY) {
                transcript.splice(i, 2, transcript[i].sync(transcript[i + 1]));
            }
        }
        // console.log('After transccompilePrecedenceFirst: ', transcript.length)
        // console.log('transcript: ', transcript)
        if (transcript.length === previousTranscriptLength)
            break;
        previousTranscriptLength = transcript.length;
    }
}
function compilePrecedenceSecond(transcript) {
    let previousTranscriptLength = transcript.length;
    while (transcript.length > 1) {
        // console.log('Before transccompilePrecedenceSecond: ', transcript.length)
        for (let i = 0; transcript[i + 1] !== undefined; i++) { // i < transcript.length - 1
            if ((transcript[i].type === type.NODE &&
                transcript[i + 1].type === type.UNSYNC) || (transcript[i].type === type.UNSYNC &&
                transcript[i + 1].type === type.NODE)) {
                transcript.splice(i, 2, transcript[i].sync(transcript[i + 1]).setType(type.NODE));
                // console.log('After transccompilePrecedenceSecond: ', transcript.length)
                // console.log('transcript: ', transcript)
                return;
            }
        }
        // console.log('After transccompilePrecedenceSecond: ', transcript.length)
        // console.log('transcript: ', transcript)
        if (transcript.length === previousTranscriptLength)
            break;
        previousTranscriptLength = transcript.length;
    }
}
class Compile {
    constructor(plan) {
        const { transcript, nodes } = planToTranscript(plan);
        this.nodes = nodes.getNodes();
        let i = 0;
        while (transcript.length > 1) {
            compilePrecedenceFirst(transcript);
            compilePrecedenceSecond(transcript);
            i++;
        }
        this.relations = transcript[0].getRelations();
    }
    toPlantUML() {
        let plantUML = '@startuml\n';
        plantUML += 'allowmixing\n';
        plantUML += '\n';
        for (const node of this.nodes) {
            plantUML += `${typeof node === 'symbol' ? 'diamond' : 'object'} ${node.name}\n`;
        }
        plantUML += '\n';
        for (const [from, to] of this.relations) {
            plantUML += `${from.name} --> ${to.name}\n`;
        }
        plantUML += '\n';
        plantUML += '@enduml\n';
        return plantUML;
    }
}
export { Compile, start, end };
// const complexPlanStrings = [
//   [[['test1'],[['fetchBulkCurrentAccounts']]], 'test2'],
//   ['fetchAccounts',
//     ['identity'],
//     ['filterSavings', 'pluck_id', 'map_fetchSavingBalance'],
//     ['filterLoans', 'pluck_id_2', 'map_fetchLoanBalance']
//   ],
//   'format',
// ];
// const complexPlan = traverse(complexPlanStrings, (node, currentPath, parent) => {
//   if (typeof node === 'string') return {name:node}
//   //return node;
// });
// console.log(
//   new Compile(complexPlan).toPlantUML()
// )
