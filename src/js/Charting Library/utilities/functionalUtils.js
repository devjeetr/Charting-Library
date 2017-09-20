

export const compose = (f, g) => {
	return function (...args) {
		return f(g(...args));
	}
}

export const curry = (fn) => {
	return function curriedFn(...args){
		if(args.length < fn.length){
			return (...rest) => curriedFn(...(rest.concat(args)));
		}else{
			return fn(...args);
		}
	}
}

/**
 * given the props object, the attribute name and an
 * update function for that attribute, creates a mutator
 * function
 */
export const createMutator = function(props, propName, updateFn, value){
    console.log("createMutator");
    return function (...args){

        if(value){
            // console.log(typeof updateFn);

            if(props[propName] && typeof updateFn === 'function'){
                props[propName] = args[0];
                updateFn(props);
            }else{
                props[propName] = args[0];
            }
            return this;
        }else{
            return props[propName];
        }
    }
}

/**
 *      Monads and Gonads
 */
export const Once = (fn) => {
    let flag = true;

    return function(...args){
        if(flag){
            flag = false;
            return fn(...args);
        }
    }
}


export const MONAD = function(modifier){
    let prototype = Object.create(null);

    function unit(value){
        let monad = Object.create(prototype);

        monad.bind = function(fn, ...args){
            return fn(value, ...args)
        }

        if(typeof modifier === 'function'){
            modifier(monad, value);
        }

        return monad;
    }

    unit.lift = function(name, fn){
            prototype[name] = function(...args){
                return unit(this.bind(fn, ...args))
            }
        }

    return unit;

}

export const Maybe = MONAD(function(monad, value){
    if(value === null || value === undefined){
        monad.is_null = true;
        monad.bind = function(){
            return monad;
        }
    }
});



