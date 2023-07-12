async function fetchImproved(...args) {
    const result = await fetch(...args);
    const body = await result.json();
    return { status: result.status, body };
}
export { fetchImproved };
