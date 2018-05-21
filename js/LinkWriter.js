class LinkWriter {
  static Parse(str) {
    console.log(str);
    let method = new RegExp('<m c="(.+?)">(.+?)<\/m>', 'g');
    str = str.replace(method, '<a class="doc-link" target="_blank" href="docs/$1.html#$2">$2</a>');

    let event = new RegExp('<e c="(.+?)">(.+?)<\/e>', 'g');
    str = str.replace(event, '<a class="doc-link" target="_blank" href="docs/$1.html#.event:on:$2">"$2"</a>');
    
    let classs = new RegExp('<c>(.+?)<\/c>', 'g');
    str = str.replace(classs, '<a class="doc-link" target="_blank" href="docs/$1.html">$1</a>');
    
    return str;
  }
}