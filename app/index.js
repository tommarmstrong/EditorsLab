HTMLTextAreaElement.prototype.getSelection = HTMLInputElement.prototype.getSelection = function() {
    var ss = this.selectionStart;
    var se = this.selectionEnd;
    if (typeof ss === "number" && typeof se === "number") {
        return this.value.substring(this.selectionStart, this.selectionEnd);
    }
    return "";
};

var title = $(".title");
var text = $("textarea");
var reset = $(".reset");

text.on("select", function () {
    console.log(this.getSelection());
});

text.on("input", function () {
    localStorage.setItem("text", $(this).val());
});

title.on("input", function () {
    localStorage.setItem("title", $(this).val());

});

reset.on("click", function () {
    title.val("");
    text.text("");
});

if (text.val() == "" && title.val() == "") {
    title.val(localStorage.getItem("title") ? localStorage.getItem("title") : "");
    text.text(localStorage.getItem("text") ? localStorage.getItem("text") : "");
}