
export class MiniFramework {
    constructor() {
        this.components = new Map();
    }

    createElement(tag, attrs = {}, children = []) {
        if (typeof children === 'string' || typeof children === 'number') {
            children = [children];
        }
        if (!Array.isArray(children)) {
            children = children ? [children] : [];
        }

        return {
            tag: tag,           
            attrs: attrs || {}, 
            children: children  
        };
    }

    render(vdom) {
        if (typeof vdom === 'string' || typeof vdom === 'number') {
            return document.createTextNode(vdom);
        }

        if (!vdom) {
            return document.createTextNode('');
        }

        const element = document.createElement(vdom.tag);

        Object.keys(vdom.attrs).forEach(attr => {
            if (attr.startsWith('on') && typeof vdom.attrs[attr] === 'function') {
                const eventName = attr.slice(2).toLowerCase(); 
                element.addEventListener(eventName, vdom.attrs[attr]);
            } else {
                element.setAttribute(attr, vdom.attrs[attr]);
            }
        });

        vdom.children.forEach(child => {
            const childElement = this.render(child);
            element.appendChild(childElement);
        });

        return element;
    }

    mount(app, container) {
        const containerElement = typeof container === 'string' 
            ? document.querySelector(container)  
            : container;                         

        if (!containerElement) {
            throw new Error(`Container ${container} not found`);
        }

        containerElement.innerHTML = '';

        const vdom = app();                     
        const element = this.render(vdom);      
        containerElement.appendChild(element);   
    }
}

export const framework = new MiniFramework();

export const h = (tag, attrs, ...children) => {
    return framework.createElement(tag, attrs, children.flat());
};
