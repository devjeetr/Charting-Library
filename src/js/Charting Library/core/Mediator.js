import {MONAD} from '../utilities/functionalUtils';

let Mediator = MONAD();

Mediator.lift("subscribe", function(eventRegistry, eventName, eventHandler){

	if(eventRegistry && eventHandler){
		if(eventRegistry[eventName] === null ||eventRegistry[eventName] === undefined){
			eventRegistry[eventName] = []
		}

		eventRegistry[eventName].push(eventHandler);
	}

	return eventRegistry;
});


Mediator.lift("publish", function(eventRegistry, eventName, ...args){

	if(eventRegistry && eventName){
		let eventEntry = eventRegistry[eventName];
		if(eventEntry){
			eventEntry.forEach(function(eventHandler){
				eventHandler(...args);
			})
		}else{
			
			eventRegistry[eventName] = [eventName];
		}
	}

	return eventRegistry;
});

export {Mediator};