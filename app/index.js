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
    text.val("");
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
        console.log("Search completed");
        displayResults(data);
    });
}

var displayResults = function (results) {
    console.log("Updating react");
    ReactDOM.render(
        <ResourceList resources={results} />,document.getElementsByClassName('resources')[0]
    );
};

class ResourceList extends React.Component {
    render() {
        if (this.props.resources.length !== 0) {
            var resources = this.props.resources.map(function (resource, i) {
                return <Resource key={i} title={resource.title} items={resource.results} />
            });
        }
        else {
            var resources = <p className="zero">Highlight some text to find related resources</p>;
        }


        return (
            <div className="resourceList">
                <h1>Resources</h1>
                {resources}
            </div>
        )
    }
}

class Resource extends React.Component {
    render() {

        var itemList = this.props.items.map(function (item, i) {
            if (item.subtitle !== undefined) {
                return (
                    <Item key={i} title={item.title} subtitle={item.subtitle} url={item.url} />
                )
            }
            else {
                return (
                    <Item key={i} title={item.title} url={item.url} />
                )
            }
        });

        return (
            <div className="resource">
                <h2>{this.props.title}</h2>
                <ul>{itemList}</ul>
            </div>
        )
    }
}

class Item extends React.Component {
    render() {

        if (this.props.subtitle !== undefined) {
            return (
                <li className="item"><a target="_blank" href={this.props.url}>{this.props.title} ({this.props.subtitle})</a></li>
            )
        }

        else {
            return (
                <li className="item"><a target="_blank" href={this.props.url}>{this.props.title}</a></li>
            )
        }

    }
}

var resources = [];

ReactDOM.render(
    <ResourceList resources={resources} />,document.getElementsByClassName('resources')[0]
);
