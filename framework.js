const SimpelSite = (function() {

    let states = []
    let stateIndex = 0


    function useState(initialValue){
        const currentIndex = stateIndex
        states[currentIndex] = states[currentIndex] !== undefined? states[currentIndex]: initialValue

        function setstate(newValue){
            states[currentIndex] = newValue
            render()
        }
        return [states[currentIndex], setstate]
    }



    let effects = []
    let effectsIndex = 0


    function useEffect(callback, dependencies) {
        const oldDependencies = effects[effectsIndex]
        let hasChanged = true

        if (oldDependencies) {
        hasChanged = dependencies.some((dep,i) => !Object.is(dep, oldDependencies[i])) 
        }

        if (hasChanged) {
            callback()
        }
        effects[effectsIndex] = dependencies
        effectsIndex++
    }





    function jsx() {

    }
    function createElement() {

    }
    function render() {

    }
    return {useState,useEffect,jsx,createElement,render}

})()

 
const {useState,useEffect,jsx,createElement,render} = SimpelSite