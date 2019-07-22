/**
 * React Renderer
 */

var React = require('react');

function ReactRenderer(/* ...objects */) {
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    var keys = Object.keys(arg);
    for (var j = 0; j < keys.length; j++) {
      var key = keys[j];
      this[key] = arg[key];
    }
  }

  if (!this.options) {
    this.options = ReactRenderer.defaults;
  }
}

ReactRenderer.defaults = {
  sanitize: false,
  langPrefix: 'lang-',
  headerPrefix: '',
};

ReactRenderer.prototype.render = function(tokens) {
  return this.renderTokens(tokens);
};

ReactRenderer.prototype.renderChildren = function(token) {
  if (token.children) {
    return this.renderTokens(token.children);
  } else {
    return null;
  }
};

ReactRenderer.prototype.renderTokens = function(tokens, key) {
  var elements = [];
  for (var i = 0; i < tokens.length; i++) {
    var element = this.renderToken(tokens[i], i);
    if (element instanceof Array) {
      for (var j = 0, e = element; j < e.length; j++) {
        elements.push(e[j]);
      }
    } else if (element) {
      elements.push(element);
    }
  }
  return elements;
};

ReactRenderer.prototype.renderToken = function(token, key) {
    switch (token.type) {
        case 'code': return this.renderCode(token, key);
        case 'blockquote': return this.renderBlockquote(token, key);
        case 'html': return this.renderHtml(token, key);
        case 'heading': return this.renderHeading(token, key);
        case 'hr': return this.renderHorizontalLine(token, key);
        case 'list': return this.renderList(token, key);
        case 'list_item': return this.renderListItem(token, key);
        case 'loose_item': return this.renderLooseItem(token, key);
        case 'paragraph': return this.renderParagraph(token, key);
        case 'table': return this.renderTable(token, key);
        case 'table_header': return this.renderTableHeader(token, key);
        case 'table_row': return this.renderTableRow(token, key);
        case 'table_header_cell': return this.renderTableHeaderCell(token, key);
        case 'table_row_cell': return this.renderTableRowCell(token, key);
        case 'strong': return this.renderStrong(token, key);
        case 'em': return this.renderEmphasized(token, key);
        case 'codespan': return this.renderCodeSpan(token, key);
        case 'del': return this.renderDeleted(token, key);
        case 'br': return this.renderLineBreak(token, key);
        case 'link': return this.renderLink(token, key);
        case 'autolink': return this.renderAutolink(token, key);
        case 'url': return this.renderUrl(token, key);
        case 'image': return this.renderImage(token, key);
        case 'text': return this.renderText(token, key);
        case 'text_block': return this.renderTextBlock(token, key);
        case 'html_block': return this.renderHtmlBlock(token, key);
        case 'space': return this.renderSpace(token, key);
        case 'def': return this.renderRefDefinition(token, key);
        default:
          throw new
            Error('Unrecognized token: ' + token.type);
    }
};

ReactRenderer.prototype.renderCode = function(token, key) {
  var code = token.text;
  var lang = token.lang;
  var className;
  if (lang) {
    className = this.options.langPrefix + lang;
  }
  return this.createElement(
    'pre',
    { key: key },
    this.createElement(
      'code',
      { className: className },
      code,
      '\n'
    )
  );
};

ReactRenderer.prototype.renderBlockquote = function(token, key) {
  return this.createElement(
    'blockquote',
    { key: key },
    this.renderChildren(token)
  );
};

ReactRenderer.prototype.renderHtml = function(token, key) {
  return null;
};

ReactRenderer.prototype.renderHeading = function(token, key) {
  var id = this.options.headerPrefix + token.name;
  return this.createElement(
    'h' + token.depth,
    { id: id, key: key },
    this.renderChildren(token)
  );
};

ReactRenderer.prototype.renderHorizontalLine = function(token, key) {
  return this.createElement(
    'hr',
    { key: key }
  );
};

ReactRenderer.prototype.renderList = function(token, key) {
  if (token.ordered) {
    return this.createElement(
      'ol',
      { key: key },
      this.renderChildren(token)
    );
  } else {
    return this.createElement(
      'ul',
      { key: key },
      this.renderChildren(token)
    );
  }
};

ReactRenderer.prototype.renderLooseItem =
ReactRenderer.prototype.renderListItem = function(token, key) {
  return this.createElement(
    'li',
    { key: key },
    this.renderChildren(token)
  );
};

ReactRenderer.prototype.renderParagraph = function(token, key) {
  return this.createElement(
    'p',
    { key: key },
    this.renderChildren(token)
  );
};

ReactRenderer.prototype.renderTable = function(token, key) {
  var rows = token.children;
  var head = this.createElement(
    'thead',
    null,
    this.renderTableHeader(rows[0])
  );
  var body = this.createElement(
    'tbody',
    null,
    this.renderTokens(rows.slice(1))
  );
  return this.createElement(
    'table',
    { key: key },
    head,
    body
  );
};

ReactRenderer.prototype.renderTableHeader =
ReactRenderer.prototype.renderTableRow = function(token, key) {
  return this.createElement(
    'tr',
    { key: key },
    this.renderChildren(token)
  );
};

ReactRenderer.prototype.renderTableHeaderCell = function(token, key) {
  return this.createElement(
    'th',
    { key: key, style: { textALign: token.align } },
    this.renderChildren(token)
  );
};

ReactRenderer.prototype.renderTableRowCell = function(token, key) {
  return this.createElement(
    'td',
    { key: key, style: { textALign: token.align } },
    this.renderChildren(token)
  );
};

ReactRenderer.prototype.renderStrong = function(token, key) {
  return this.createElement(
    'strong',
    { key: key },
    this.renderChildren(token)
  );
};

ReactRenderer.prototype.renderEmphasized = function(token, key) {
  return this.createElement(
    'em',
    { key: key },
    this.renderChildren(token)
  );
};

ReactRenderer.prototype.renderCodeSpan = function(token, key) {
  var code = token.text;
  return this.createElement(
    'code',
    { key: key },
    code
  );
};

ReactRenderer.prototype.renderLineBreak = function(token, key) {
  return this.createElement(
    'br',
    { key: key }
  );
};

ReactRenderer.prototype.renderDeleted = function(token, key) {
  return this.createElement(
    'del',
    { key: key },
    this.renderChildren(token)
  );
};

ReactRenderer.prototype.renderUrl =
ReactRenderer.prototype.renderAutolink = function(token, key) {
  if (!this.sanitizeUrl(token.href)) {
    return '';
  }
  var href = token.href;
  var text = token.text;
  return this.createElement(
    'a',
    { key: key, href: href },
    text
  );
};

ReactRenderer.prototype.renderLink = function(token, key) {
  if (!this.sanitizeUrl(token.href)) {
    return null;
  }
  var href = token.href;
  var title = token.title;
  return this.createElement(
    'a',
    { key: key, href: href, title: title },
    this.renderChildren(token)
  );
};

ReactRenderer.prototype.sanitizeUrl = function(href) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(href)
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return false;
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
      return false;
    }
  }
  return true;
}

ReactRenderer.prototype.renderImage = function(token, key) {
  var href = token.href;
  var title = token.title;
  var text = token.text;
  return this.createElement(
    'img',
    { key: key, src: href, alt: text, title: title }
  );
};

ReactRenderer.prototype.renderText = function(token, key) {
  return token.text;
};

ReactRenderer.prototype.renderHtmlBlock =
ReactRenderer.prototype.renderTextBlock = function(token, key) {
  if (token.paragraph) {
    return this.renderParagraph(token, key);
  } else {
    return this.renderChildren(token);
  }
};

ReactRenderer.prototype.renderRefDefinition =
ReactRenderer.prototype.renderSpace = function(token, key) {
  return null;
};

ReactRenderer.prototype.createElement = function(type, props, children) {
  return React.createElement(type, props, children);
};

module.exports = ReactRenderer;