import React, { useEffect, useRef, useState, useCallback } from 'react';
import 'grapesjs/dist/css/grapes.min.css';
import { addBlocks } from "./blocks";
import {
    extractHTMLContent,
    isContentHTML,
    getFullHtml,
    generateFilename,
    getBaseURL
} from "./utils";
import { LinearProgress, IconButton, Tooltip } from '@mui/material';
import { OpenWith, Launch as Preview } from '@mui/icons-material';

const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};


const GrapesJSEditor = ({ htmlContent, params }) => {
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const [grapesjs, setGrapesjs] = useState(null);
    const { msgIndex, messages, setMessages, chatAPI, KB, uploadFileAPI, setBlockingLoading, blockAutoscroll,
    setInputValue, sendButtonRippleRef } = params;

    const currentHTMLContentRef = useRef(htmlContent);
    const isLocalContentUpdate = useRef(false);
    const [isSaving, setIsSaving] = useState(false);
    const [dragMode, setDragMode] = useState(undefined);

    async function uploadAsset(file) {
        const res = await uploadFileAPI(file, 'files')
        return getBaseURL(KB) + decodeURIComponent(res?.config.url.split('/').pop().split('?')[0]);
    }

    const uploadHTMLContent = useCallback(async (htmlContent) => {
        const html = extractHTMLContent(htmlContent);
        if (!html) return;
        try {
            const blob = new Blob([html], { type: 'text/html' });
            const file = new File([blob], generateFilename(htmlContent), { type: 'text/html' });
            await uploadAsset(file)
        } catch (e) {
            console.error('Error during upload:', e);
        }
    }, [uploadFileAPI]);

    const save = async (updatedHTMLContent) => {
        blockAutoscroll();
        const html = extractHTMLContent(updatedHTMLContent);
        if (!html) return;
        try {
            setIsSaving(true);
            isLocalContentUpdate.current = true;
            await Promise.all([
                chatAPI.chatEditMessage(window.openkbs.parseChatId(), messages[msgIndex].msgId, updatedHTMLContent),
                uploadHTMLContent(html)
            ]);
            setMessages(prevMessages => prevMessages.map((msg, index) =>
                index === msgIndex ? { ...msg, content: updatedHTMLContent } : msg
            ));
            currentHTMLContentRef.current = html;

        } catch (e) {
            console.error(e);
        } finally {
            setIsSaving(false);
        }
    }

    const handleSave = useCallback(save, [chatAPI, messages, msgIndex, setMessages, uploadHTMLContent]);
    const debouncedHandleSave = useRef(debounce(handleSave, 300)).current;

    useEffect(() => {
        const loadGrapesJS = async () => {
            const grapesjsInstance = (await import('grapesjs')).default;
            const grapesjsPresetWebpage = (await import('grapesjs-preset-webpage')).default;
            const grapesjsBlocksBasic = (await import('grapesjs-blocks-basic')).default;
            setGrapesjs({ grapesjs: grapesjsInstance, grapesjsPresetWebpage, grapesjsBlocksBasic });
        };

        loadGrapesJS();
    }, []);

    const initializeEditor = useCallback((content) => {
        if (grapesjs && editorContainerRef.current) {
            const { grapesjs: grapesjsInstance, grapesjsPresetWebpage, grapesjsBlocksBasic } = grapesjs;

            const editor = grapesjsInstance.init({
                dragMode: dragMode,
                container: editorContainerRef.current,
                fromElement: false,
                components: content,
                width: 'auto',
                storageManager: false,
                plugins: [grapesjsPresetWebpage, grapesjsBlocksBasic],
                pluginsOpts: {
                    grapesjsPresetWebpage: {},
                },
                parser: {
                    optionsHtml: { allowScripts: true },
                },
                colorPicker: {   appendTo: 'parent',   offset: { top: 26, left: -166, },   },
                assetManager: {
                    upload: false,
                    uploadFile: async (event) => {
                        setBlockingLoading(true)
                        const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
                        const toAdd = [];
                        for (const file of files) {
                            try {
                                toAdd.push({ src: await uploadAsset(file) });
                            } catch (error) {
                                console.error('Error uploading file:', error);
                            }
                        }
                        setTimeout(() => {
                            editor.AssetManager.add(toAdd)
                            setBlockingLoading(false)
                        }, 1000)

                    }
                }
            });

            editor.on('asset:add', (asset) => {
                const imageComponent = editor.getSelected();
                if (imageComponent && imageComponent.is('image')) {
                    imageComponent.addStyle({
                        width: '256px',
                        height: 'auto',
                    });
                }
            });

            if (window.openkbs.hasActivity()) uploadHTMLContent(content)

            editor.Panels.removeButton('options', 'export-template');
            editor.Panels.removeButton('options', 'sw-visibility');
            editor.Panels.removeButton('devices-c', 'set-device-desktop');
            editor.Panels.removeButton('devices-c', 'set-device-tablet');
            editor.Panels.removeButton('devices-c', 'set-device-mobile');
            editor.Panels.removeButton('options', 'preview');

            if (window.openkbs.isMobile) {
                console.log(editor.Panels)
                editor.Panels.removeButton('views', 'open-sm');
                editor.Panels.removeButton('views', 'open-tm');
                editor.Panels.removeButton('views', 'open-layers');
                editor.Panels.removeButton('views', 'open-blocks');
                document.documentElement.style.setProperty('--gjs-left-width', '0%');
                document.documentElement.style.setProperty('--gjs-right-width', '0%');
                editor.Panels.removeButton('options', 'fullscreen');
                editor.Panels.removeButton('options', 'gjs-open-import-webpage');
            }
            editorRef.current = editor;
            window.editor = editor;

            addBlocks({ editor, KB });

            editor.on('load', () => {
                const bm = editor.BlockManager;
                const categories = bm.getCategories();

                categories.each(category => {
                    if (category.get('id') === 'Top Picks') {
                        category.set('open', true);
                        category.set('order', 1);
                    } else {
                        category.set('open', false);
                        const currentOrder = category.get('order') || 0;
                        category.set('order', 10 + currentOrder);
                    }
                });

                bm.render();
            });

            editor.on('block:drag:stop', (component, block) => {
                if (block && component && !block.get('id')?.startsWith('image')) {
                    blockAutoscroll(0);
                    const msg = `Make the "${block.get('label')}" a natural part of this banner in terms of style, colors, content and design.`;
                    setInputValue(prev => prev ? prev + msg : msg )
                    setTimeout(() => sendButtonRippleRef?.current?.pulsate(), 100)
                }
            });

            editor.on('component:add component:remove component:update component:styleUpdate style:change', () => {
                const updatedHTMLContent = getFullHtml(editorRef.current, currentHTMLContentRef.current);
                if (updatedHTMLContent !== currentHTMLContentRef.current) {
                    debouncedHandleSave(updatedHTMLContent);
                }
            });
        }
    }, [grapesjs, debouncedHandleSave, KB, dragMode, uploadFileAPI, uploadHTMLContent]);

    useEffect(() => {
        initializeEditor(currentHTMLContentRef.current);
    }, [grapesjs, initializeEditor]);

    useEffect(() => {
        if (isLocalContentUpdate.current) {
            isLocalContentUpdate.current = false;
            return;
        }

        if (editorRef.current && htmlContent !== currentHTMLContentRef.current) {
            currentHTMLContentRef.current = htmlContent;
            initializeEditor(htmlContent);
        }
    }, [htmlContent, initializeEditor]);

    const handleDragModeToggle = () => {
        setDragMode(prevMode => (prevMode === 'translate' ? 'disabled' : 'translate'));
    };

    const handlePreviewClick = async () => {
        setBlockingLoading({text: "Upload Webpage"})
        await save(currentHTMLContentRef.current)
        const url = getBaseURL(KB) + generateFilename(currentHTMLContentRef.current);
        window.open(url, '_blank');
        setBlockingLoading(false)
    };

    const loaderStyle = { position: 'absolute', top: 14, left: 0, right: 0, height: 2, zIndex: 1000 };
    return (
        <>
            <div style={{ position: 'relative', height: 0, overflow: 'visible' }}>
                {isSaving && (<LinearProgress style={loaderStyle} />)}
            </div>
            {grapesjs && (
                <>
                    <Tooltip title={dragMode === 'translate' ? 'Disable drag mode' : 'Enable drag mode'} placement={'top'}>
                        <IconButton
                            onClick={handleDragModeToggle}
                            aria-label="drag mode"
                            style={{ position: 'absolute', top: 38, left: 42, zIndex: 100, color: dragMode === 'translate' ? '#D97AA6' : '#B9A5A6' }}
                        >
                            <OpenWith style={{ fontSize: 24 }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Open Live Page" placement={'top'}>
                        <IconButton
                            onClick={handlePreviewClick}
                            aria-label="preview mode"
                            style={{ position: 'absolute', top: 38, left: 10, zIndex: 100, color: '#B9A5A6' }}
                        >
                            <Preview style={{ fontSize: 24 }} />
                        </IconButton>
                    </Tooltip>
                </>
            )}
            <div ref={editorContainerRef} style={{ paddingTop: 14 }}></div>
        </>
    );
};

const onRenderChatMessage = async (params) => {
    const { content } = params.messages[params.msgIndex];
    if (isContentHTML(content)) {
        const html = extractHTMLContent(content) || content;
        return <GrapesJSEditor htmlContent={html} params={params} />;
    }

    return null;
};

const Header = ({ setRenderSettings }) => {
    useEffect(() => {
        window.openkbs.disableDropzone = []
        setRenderSettings({
            setMessageWidth: (content) => isContentHTML(content) ? '90%' : undefined,
            enableGenerationModelsSelect: true,
            disableShareButton: true,
            disableBalanceView: true,
            disableSentLabel: false,
            disableChatAvatar: false,
            disableChatModelsSelect: false,
            disableContextItems: true,
            disableCopyButton: false,
            disableEmojiButton: false,
            disableTextToSpeechButton: false,
            disableMobileLeftButton: false,
        });
    }, [setRenderSettings]);

    return null;
};

const exports = { onRenderChatMessage, Header };
window.contentRender = exports;
export default exports;