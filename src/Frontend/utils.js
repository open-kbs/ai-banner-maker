import html2canvas from "html2canvas";

export const getFullHtml = (editor, originalHtml) => {
    const parser = new DOMParser();

    // Parse the original HTML
    const dom = parser.parseFromString(originalHtml, 'text/html');

    // Get the head and body elements
    const head = dom.head;
    const body = dom.body;

    // Remove existing <style> tags from the head
    const styleElements = head.querySelectorAll('style');
    styleElements.forEach(el => el.parentNode.removeChild(el));

    // Ensure UTF-8 charset is set
    let charsetMeta = head.querySelector('meta[charset]');
    if (!charsetMeta) {
        charsetMeta = dom.createElement('meta');
        charsetMeta.setAttribute('charset', 'UTF-8');
        head.insertBefore(charsetMeta, head.firstChild);
    } else {
        charsetMeta.setAttribute('charset', 'UTF-8');
    }

    // Get updated content from the editor
    const updatedHtmlContent = editor.getHtml();
    const updatedCssContent = editor.getCss();
    const updatedJsContent = editor.getJs();

    // Parse updatedHtmlContent to ensure we don't include extra <html>, <head>, <body> tags
    const updatedDom = parser.parseFromString(updatedHtmlContent, 'text/html');

    // Replace the body content with updated content
    body.innerHTML = updatedDom.body.innerHTML;

    // Append updated CSS in a <style> tag in the head
    if (updatedCssContent.trim()) {
        const styleEl = dom.createElement('style');
        styleEl.textContent = updatedCssContent;
        head.appendChild(styleEl);
    }

    // Append updated JS in a <script> tag in the body
    if (updatedJsContent.trim()) {
        const scriptEl = dom.createElement('script');
        scriptEl.textContent = updatedJsContent;
        body.appendChild(scriptEl);
    }

    // Serialize the DOM back to HTML using outerHTML to prevent character encoding issues
    const doctype = '<!DOCTYPE html>\n';
    const fullHtml = doctype + dom.documentElement.outerHTML;

    // Return the formatted HTML code block
    return '```html\n' + fullHtml.trim() + '\n```';
};

export function getBaseURL(KB) {
    return `https://web.openkbs.com/${KB?.kbId}/`;
}

export function generateFilename(html) {
    const title = new DOMParser()
        .parseFromString(html, 'text/html')
        .querySelector('title')?.textContent || 'untitled.html';
    return title.trim().toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') + '.html';
}

export function extractHTMLContent(content) {
    if (!content) return null;
    const languageDetected = /```(?<language>\w+)/g.exec(content)?.groups?.language;
    const htmlMatch = content.match(/<html[^>]*>[\s\S]*<\/html>/);
    if (htmlMatch && (!languageDetected || languageDetected === 'html')) {
        return htmlMatch[0];
    }
    return null;
}

export function isContentHTML(content) {
    if (!content) return content;
    const languageDetected = /```(?<language>\w+)/g.exec(content)?.groups?.language;
    return content?.match?.(/<html[^>]*>[\s\S]*<\/html>/) &&
        (!languageDetected || languageDetected === 'html');
}


export const handleCaptureClick = async (editorRef, setLoading) => {
    setLoading(true)
    if (editorRef.current) {
        // Get the editor iframe element
        const iframe = editorRef.current.Canvas.getFrameEl();

        // Clone the iframe content into a div
        const editorContent = iframe.contentDocument.body.cloneNode(true);
        const container = document.createElement('div');
        container.appendChild(editorContent);
        container.style.width = iframe.clientWidth + 'px';
        container.style.height = iframe.clientHeight + 'px';
        container.style.background = 'white';
        document.body.appendChild(container);

        // Use html2canvas to capture the content
        html2canvas(container, {
            scale: 4,
            backgroundColor: 'white',
            width: iframe.clientWidth,
            height: iframe.contentDocument.body.scrollHeight,
            useCORS: true,
        })
            .then(canvas => {
                const dataUrl = canvas.toDataURL('image/png', 0.95);
                document.body.removeChild(container);
                const link = document.createElement('a');
                link.download = 'editor-capture.png';
                link.href = dataUrl;
                link.target = '_blank';
                link.click();
                setLoading(false)
            })
            .catch(error => {
                console.error('Error capturing the editor view:', error);
                document.body.removeChild(container);
                setLoading(false)
            });
    }
};
