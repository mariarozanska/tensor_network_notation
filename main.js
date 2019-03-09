// cases
// matrix-vector multiplication
// const formula = 'A_{ik}b_{k}'
// const outputIndices = 'i'
// matrix-matrix multiplication
// const formula = 'A_{ik}B_{kj}'
// const outputIndices = 'ij'
// dot product - vectors
// const formula = 'a_{i}b_{i}'
// const outputIndices = ''
// TODO: podwójne zaznaczać dwoma kreskami lub jedną grubszą
// dot product - matrix
// const formula = 'A_{ij}B_{ij}'
// const outputIndices = ''
// TODO: dwa razy pojawia się i na wyjściu
// batch matrix multiplication
// const formula = 'A_{ijk}B_{ikl}'
// const outputIndices = 'ijl'
// tensor contraction
// const formula = 'A_{pqrs}B_{tuqvr}'
// const outputIndices = 'pstuv'
// bilinear transformation
// const formula = 'A_{ik}B_{jkl}C_{il}'
// const outputIndices = 'ij'
// TODO: trzeba dodać rysowanie pętli
// trace
// const formula = 'A_{ii}'
// const outputIndices = ''

// const formula = 'A_{ik}B_{jkl}C_{il}D_{jz}'
// const outputIndices = 'iz'

document.getElementById('draw').addEventListener('click', () => {
    // inputs
    const formula = document.getElementById('formula').value || 'x_{m}A_{min}B_{njk}'
    const outputIndices = document.getElementById('outputIndices').value || 'ik'

    const tnn = new TNN()
    const { tensors, contractions } = tnn.getData(formula, outputIndices)
    draw(tensors, contractions)
})