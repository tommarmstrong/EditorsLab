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
    search(this.getSelection());
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

var search = function (selection) {
    $.ajax({
        "url": "search",
        "data": {"q":selection}
    }).done(function (data) {
       console.log(data);
    });
}

var displayResults = function (results) {

};

class ResourceList extends React.Component {
    render() {
        var itemArray = [{'title': 'hello'}];
        return (
            <div className="resourceList">
                <h1>Resources</h1>
                <Resource title="Test" items={itemArray} />
            </div>
        )
    }

}

class Resource extends React.Component {
    render() {

        var itemList = this.props.items.map(function (item) {
            return (
                <Item title={item.title} />
            )
        });

        return (
            <div className="resource">
                <h2>{this.props.title}</h2>
                {itemList}
            </div>
        )
    }
}

class Item extends React.Component {
    render() {
        return (
            <div className="item">
                <h3>{this.props.title}</h3>
            </div>
        )
    }
}

ReactDOM.render(
    <ResourceList />,document.getElementsByClassName('resources')[0]
);