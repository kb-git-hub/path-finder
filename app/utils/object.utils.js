// get query and deconstruct
function generateQueryConstructor(query) {
    for (const key in query) {
        this[key] = query[key]; // The context is grid object and assigns key-values
    }
}

export default generateQueryConstructor;
