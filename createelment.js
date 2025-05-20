export const ce = (tagName, classname, textContent = "") => {
    const element = document.createElement(tagName);
    if (classname) {
        classname.split(" ").filter(cls => cls != "").forEach(cls => element.classList.add(cls));
    }
    element.textContent = textContent;

    element.__proto__.append = function (...childs) {
        Element.prototype.append.call(this, ...childs);
        return this;
    };
    element.__proto__.setAtr = function (attr, value) {
        Element.prototype.setAttribute.call(this, attr, value);
        return this;
    }
    element.__proto__.setText = function (text) {
        this.textContent = text; 
        return this;
    };
    

    return element;
}

export const div = (className, textContent = "") => {
    const divElement = ce("div", className, textContent);
    return divElement;
}

export const input = (type, placeholder = "") => {
    const inputElement = ce("input", "", "")
    inputElement.type = type;
    inputElement.placeholder = placeholder;
    return inputElement.setAtr('name', placeholder);
}

export const button = (classname, textContent = "") => {
    return ce('button', classname, textContent);
}



