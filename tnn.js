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


    function getDirectionOfOuterEdge(i, contractions, tensors, numberOfVariables) {
        const tensor = tensors[i]
        const tensorTargets = []
        contractions.forEach((edge) => {
            if (edge.source == tensor) {
                tensorTargets.push(edge.target)
            }
        })
        // TODO: trzeba zmienić dla bardziej złożonych diagramów (wieloliniowych)
        let direction = 'up'
        if ((i == 0) && (tensorTargets.indexOf('left') == -1)) {
            direction = 'left'
        } else if ((i == numberOfVariables - 1) && (tensorTargets.indexOf('right') == -1)) {
            direction = 'right'
        } else if (tensorTargets.indexOf('down') == -1) {
            direction = 'down'
        }
        return direction
    }


    // add outer edges related to the i-th variable to contractions
    function addOuterEdges(i, indices, tensors, contractions, outputIndices) {
        indices[i].forEach((index) => {
            if (outputIndices.indexOf(index) != -1) {
                const direction = getDirectionOfOuterEdge(i, contractions, tensors, indices.length)
                const outerEdge = { source: tensors[i], target: direction, name: index }
                contractions.push(outerEdge)
            }
        })
    }

    return {
        getData: (formula, outputIndices) => {
            const { names, indices } = getVariables(formula)

            const tensors = []
            const contractions = []
            names.forEach((name, i) => {
                // TODO: trzeba zmienić dla bardziej złożonych diagramów (wieloliniowych)
                const node = { name: name, x: i, y: 0 }
                tensors.push(node)
                addInnerEdges(i, indices, tensors, contractions, outputIndices)
                addOuterEdges(i, indices, tensors, contractions, outputIndices)
            })

            return { tensors, contractions }
        }
    }

}