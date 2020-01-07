import { cleanUrl, escape, unescape } from './helpers.mjs';
import { mergeDefaults } from './defaults.mjs';
import { SluggerMarked } from './slugger.mjs';
import { decodeHtmlEntities } from './html-entities.mjs';

class BaseRenderer {
  constructor(options, props) {
    this.options = mergeDefaults(options);
    this.slugger = null;
    if (typeof(this.options.headerIds) === 'string') {
    } else {
      this.sluggerClass = SluggerMarked;
    }

    Object.assign(this, props);
  }

  initialize() {
    this.slugger = new this.sluggerClass(this.options.headerIds);
  }

  createElement(type, props, children) { /* abstract */ }

  render(tokens) { /* abstract */ }

  renderChildren(token) {
    if (token.children && token.children.length > 0) {
      return this.renderTokens(token.children);
    }
  }

  renderTokens(tokens) {
    const elements = [];
    for (let token of tokens) {
      const element = this.renderToken(token);
      if (element instanceof Array) {
        for (let e of element) {
          elements.push(e);
        }
      } else if (element) {
        elements.push(element);
      }
    }
    return elements;
  }

  renderToken(token) {
    switch (token.type) {
      case 'text': return this.renderText(token);
      case 'text_block': return this.renderTextBlock(token);
      case 'space': return this.renderSpace(token);
      case 'strong': return this.renderStrong(token);
      case 'em': return this.renderEmphasized(token);
      case 'codespan': return this.renderCodeSpan(token);
      case 'del': return this.renderDeleted(token);
      case 'br': return this.renderLineBreak(token);
      case 'link': return this.renderLink(token);
      case 'autolink': return this.renderAutolink(token);
      case 'url': return this.renderUrl(token);
      case 'image': return this.renderImage(token);
      case 'html_block': return this.renderHtmlBlock(token);
      case 'paragraph': return this.renderParagraph(token);
      case 'code': return this.renderCode(token);
      case 'blockquote': return this.renderBlockquote(token);
      case 'html_tag': return this.renderHtmlTag(token);
      case 'html_element': return this.renderHtmlElement(token);
      case 'heading': return this.renderHeading(token);
      case 'hr': return this.renderHorizontalRule(token);
      case 'list': return this.renderList(token);
      case 'list_item': return this.renderListItem(token);
      case 'loose_item': return this.renderLooseItem(token);
      case 'table': return this.renderTable(token);
      case 'table_header': return this.renderTableHeader(token);
      case 'table_row': return this.renderTableRow(token);
      case 'table_header_cell': return this.renderTableHeaderCell(token);
      case 'table_row_cell': return this.renderTableRowCell(token);
      case 'def': return this.renderRefDefinition(token);
      case 'raw': return this.renderRaw(token);
      case 'checkbox': return this.renderCheckbox(token);
      default:
        throw new Error('Unrecognized token: ' + token.type);
    }
  }

  renderCode(token) {
    const { text, lang, highlighted } = token;
    const { langPrefix } = this.options;
    const props = (lang) ? { className: langPrefix + lang } : null;
    const code = (highlighted) ? this.packageCode(highlighted) : text;
    const codespan = this.createElement('code', props, code);
    return this.createElement('pre', null, [ codespan ], { after: (lang) ? '\n' : '' });
  }

  renderBlockquote(token) {
    const children = this.renderChildren(token);
    return this.createElement('blockquote', null, children, { before: '\n', after: '\n' });
  }

  renderHtmlTag(token) {
    // raw HTML requires special handling
  }

  renderHtmlElement(token) {
    const { tagName, attributes } = token;
    if (this.shouldOmit(tagName, attributes)) {
      return;
    }
    const children = this.renderChildren(token);
    return this.createElement(tagName, attributes, children);
  }

  renderHeading(token) {
    const type = `h${token.depth}`;
    const id = this.generateHeadingId(token);
    const props = (id !== undefined) ? { id } : null;
    const children = this.renderChildren(token);
    return this.createElement(type, props, children, { after: '\n' });
  }

  renderHorizontalRule(token) {
    return this.createElement('hr', null, null, { after: '\n' });
  }

  renderList(token) {
    const { ordered, start } = token;
    const type = (ordered) ? 'ol' : 'ul';
    const props = (ordered && start !== 1) ? { start } : null;
    const children = this.renderChildren(token);
    return this.createElement(type, props, children, { before: '\n', after: '\n' });
  }

  renderListItem(token) {
    const { checked, loose } = token;
    let children;
    if (checked === undefined) {
      children = this.renderChildren(token);
    } else {
      // put checkbox in front of content, inserting it into the list of
      // inline elements if that's what follow; otherwise (if the list item
      // holds a block element), insert it into a separate block
      const checkbox = { type: 'checkbox', checked };
      const space = { type: 'text', text: ' ', html: ' ' };
      let tokens = token.children.slice();
      const first = tokens[0];
      if (first && (first.type === 'text_block' || first.type === 'paragraph')) {
        const tb = { type: first.type, children: tokens[0].children.slice() };
        tb.children.unshift(space);
        if (loose && !this.options.omitLinefeed) {
          tb.children.unshift(space);
        }
        tb.children.unshift(checkbox);
        tokens[0] = tb;
      } else {
        // put p tag around checkbox if item is loose
        const tb = {
          type: (loose) ? 'paragraph' : 'text_block',
          children: [ checkbox, space ]
        };
        tokens.unshift(tb);
      }
      children = this.renderTokens(tokens);
    }
    return this.createElement('li', null, children, { after: '\n' });
  }

  renderLooseItem(token) {
    return this.renderListItem(token);
  }

  renderCheckbox(token) {
    const { checked } = token;
    const props = {
      defaultChecked: (checked) ? true : undefined,
      disabled: true,
      type: 'checkbox',
    };
    return this.createElement('input', props, null);
  }

  renderParagraph(token) {
    const children = this.renderChildren(token);
    return this.createElement('p', null, children, { after: '\n' });
  }

  renderTable(token) {
    const head = this.renderTableHead(token);
    const body = this.renderTableBody(token);
    const children = [ head, body ];
    return this.createElement('table', null, children, { before: '\n', after: '\n' });
  }

  renderTableHead(token) {
    const children = this.renderTokens(token.children.slice(0, 1));
    return this.createElement('thead', null, children, { before: '\n', after: '\n' });
  }

  renderTableBody(token) {
    const children = this.renderTokens(token.children.slice(1));
    if (children.length > 0) {
      return this.createElement('tbody', null, children);
    }
  }

  renderTableRow(token) {
    const children = this.renderChildren(token);
    return this.createElement('tr', null, children, { before: '\n', after: '\n' });
  }

  renderTableHeader(token) {
    return this.renderTableRow(token);
  }

  renderTableHeaderCell(token) {
    const { align } = token;
    const props = (align) ? { align } : null;
    const children = this.renderChildren(token);
    return this.createElement('th', props, children, { after: '\n' });
  }

  renderTableRowCell(token) {
    const { align } = token;
    const props = (align) ? { align } : null;
    const children = this.renderChildren(token);
    return this.createElement('td', props, children, { after: '\n' });
  }

  renderStrong(token) {
    const children = this.renderChildren(token);
    return this.createElement('strong', null, children);
  }

  renderEmphasized(token) {
    const children = this.renderChildren(token);
    return this.createElement('em', null, children);
  }

  renderCodeSpan(token) {
    const { text } = token;
    const children = text;
    return this.createElement('code', null, children);
  }

  renderLineBreak(token) {
    return this.createElement('br');
  }

  renderDeleted(token) {
    const children = this.renderChildren(token);
    return this.createElement('del', null, children);
  }

  renderUrl(token) {
    const { href: hrefUnescaped, text } = token;
    const children = text;
    const href = this.cleanUrl(hrefUnescaped, false, true);
    if (href === null) {
      return children;
    }
    return this.createElement('a', { href }, children);
  }

  renderAutolink(token) {
    return this.renderUrl(token);
  }

  renderLink(token) {
    const { hrefHtml, title } = token;
    const children = this.renderChildren(token);
    const href = this.cleanUrl(hrefHtml, true, true);
    if (href === null) {
      return children;
    }
    return this.createElement('a', { href, title }, children);
  }

  renderImage(token) {
    const { hrefHtml, title, text } = token;
    const src = this.cleanUrl(hrefHtml, true, true);
    if (src === null) {
      return text;
    }
    return this.createElement('img', { src, alt: text, title });
  }

  renderText(token) {
    return token.text;
  }

  renderHtmlBlock(token) {
    return this.renderChildren(token);
  }

  renderTextBlock(token) {
    return this.renderChildren(token);
  }

  renderRefDefinition(token) {
  }

  renderSpace(token) {
  }

  renderRaw(token) {
  }

  renderPlainText(token) {
    const { text, html, children } = token;
    if (text) {
      return text;
    } else if (children) {
      const content = [];
      for (let child of children) {
        content.push(this.renderPlainText(child));
      }
      return content.join('');
    } else {
      return '';
    }
  }

  renderMarkedHeaderText(token) {
    const { text, html, children } = token;
    if (text) {
      // the Marked slugger expects text with HTML entities
      return html ? escape(html) : text;
    } else if (children) {
      const content = [];
      for (let child of children) {
        content.push(this.renderMarkedHeaderText(child));
      }
      return content.join('');
    } else if (html) {
      // the Marked slugger expects to see HTML tags too
      return html;
    } else {
      return '';
    }
  }

  generateHeadingId(token) {
    const { headerIds, headerPrefix } = this.options;
    if (headerIds) {
      let plain;
      if (this.slugger instanceof SluggerMarked) {
        plain = this.renderMarkedHeaderText(token)
        plain = unescape(plain);
      } else {
        plain = this.renderPlainText(token);
      }
      name = this.slugger.slug(plain);
      return headerPrefix + name;
    }
  }

  cleanUrl(url, escaped, unescapeAfter) {
    const { sanitize, baseUrl } = this.options;
    if (!escaped) {
      // cleanUrl() expect the URL to be escaped
      url = escape(url);
    }
    let cleaned = cleanUrl(sanitize, baseUrl, url);
    if (unescapeAfter) {
      cleaned = decodeHtmlEntities(cleaned);
    }
    return cleaned;
  }

  shouldOmit(tagName, attributes) {
    const omit = this.options.omitTags;
    if (omit instanceof Array) {
      if (omit.indexOf(tagName) !== -1) {
        return true;
      }
    } else if (omit instanceof Function) {
      return omit(tagName, attributes);
    }
  }

  packageCode(highlighted) {
    return highlighted;
  }
}

export {
  BaseRenderer,
  BaseRenderer as default,
};
