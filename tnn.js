function TNN() {

    // get names and indices of variables from formula
    function getVariables(formula) {
        const varsRegex = /(\w)_{(\w+)}/g
        const names = []
        const indices = []
        let match = varsRegex.exec(formula)
        while (match) {
            names.push(match[1])
            indices.push(match[2])
            match = varsRegex.exec(formula)
        }
        return { names, indices: indices.map(inds => inds.split('')) }
    }


    // add inner edges between the i-th variable and all previous ones to contractions
    function addInnerEdges(i, indices, tensors, contractions, outputIndices) {
        indices[i].forEach((index) => {
            for (let j = 0; j < i; j++) {
                if ((indices[j].indexOf(index) != -1) && (outputIndices.indexOf(index) == -1)) {
                    const innerEdge = { source: tensors[i], target: tensors[j], name: index }
                    contractions.push(innerEdge)
                }
            }
        })
    }


    function getDirectionOfOuterEdge(i, contractions, tensors, maxx) {
        const tensor = tensors[i]
        const tensorTargets = []
        contractions.forEach((edge) => {
            if (edge.source == tensor) {
                tensorTargets.push(edge.target)
            }
        })
        // TODO: jeszcze uwzględnić położenie y (może skorzystać z frame)
        let direction = 'up'
        if ((tensor.x == 0) && (tensorTargets.indexOf('left') == -1)) {
            direction = 'left'
        } else if ((tensor.x == maxx) && (tensorTargets.indexOf('right') == -1)) {
            direction = 'right'
        } else if (tensorTargets.indexOf('down') == -1) {
            direction = 'down'
        }
        return direction
    }


    // add outer edges related to the i-th variable to contractions
    function addOuterEdges(i, indices, tensors, contractions, outputIndices, maxx) {
        indices[i].forEach((index) => {
            if (outputIndices.indexOf(index) != -1) {
                const direction = getDirectionOfOuterEdge(i, contractions, tensors, maxx)
                const outerEdge = { source: tensors[i], target: direction, name: index }
                contractions.push(outerEdge)
            }
        })
    }


    // TODO: trzeba przestawiać zmienne, żeby nie było przecinających się krawędzi
    function addNode(name, i, tensors, neighbours, outers, frame) {
        let y = tensors.length
        let x = 0
        if (tensors.length == 0 && outers.indexOf(name) == -1) {
            y = y + 1
        } else if (frame[0][0] == '_' && outers.indexOf(name) != -1) {
            y = 0
            x = 0
        } else if (tensors.length != 0) {
            neighbours[i].forEach((neighbour) => {
                tensors.forEach((tensor) => {
                    if (tensor.name == neighbour) {
                        if (frame[tensor.y][tensor.x + 1] == '_') {
                            x = tensor.x + 1
                            y = tensor.y
                        } else if (frame[tensor.y + 1][tensor.x] == '_'){
                            x = tensor.x
                            y = tensor.y +1
                        } else if (frame[tensor.y + 1][tensor.x + 1] == '_') {
                            x = tensor.x + 1
                            y = tensor.y + 1
                        }
                    }
                })
            })
        }
        frame[y][x] = name
        const node = { name: name, x: x, y: y }
        tensors.push(node)
    }


    // get names of variables which have outer edges
    function getOuters(names, indices, outputIndices) {
        const outers = []
        indices.forEach((inds, i) => {
            inds.forEach((idx) => {
                if (outputIndices.indexOf(idx) != -1) {
                    outers.push(names[i])
                }
            })
        })
        return outers
    }


    // get names of adjacent variables for every variables
    function getNeighbours(names, indices, outputIndices) {
        const neighbours = []
        indices.forEach((indsI, i) => {
            const neighboursI = []
            for (let j = 0; j < i; j++) {
                indsI.forEach((idx) => {
                    if (indices[j].includes(idx) && outputIndices.indexOf(idx) == -1) {
                        neighboursI.push(names[j])
                    }
                })
            }
            neighbours.push(neighboursI)
        })
        return neighbours
    }


    return {
        getData: (formula, outputIndices) => {
            const { names, indices } = getVariables(formula)

            const tensors = []
            const contractions = []
            const frame = Array(names.length).fill().map(() => Array(names.length).fill('_'))
            const outers = getOuters(names, indices, outputIndices)
            const neighbours = getNeighbours(names, indices, outputIndices)

            names.forEach((name, i) => {
                addNode(name, i, tensors, neighbours, outers, frame)
                addInnerEdges(i, indices, tensors, contractions, outputIndices)
            })

            const maxx = Math.max.apply(Math, tensors.map(tensor => tensor.x))
            for (let i = 0; i < tensors.length; i++) {
                addOuterEdges(i, indices, tensors, contractions, outputIndices, maxx)
            }

            return { tensors, contractions }
        }
    }

}