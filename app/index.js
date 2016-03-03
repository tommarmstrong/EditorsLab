HTMLTextAreaElement.prototype.getSelection = HTMLInputElement.prototype.getSelection = function() {
    var ss = this.selectionStart;
    var se = this.selectionEnd;
    if (typeof ss === "number" && typeof se === "number") {
        return this.value.substring(this.selectionStart, this.selectionEnd);
    }
    return "";
};

////alert(document.getElementsByTagName("textarea")[0].getSelection());