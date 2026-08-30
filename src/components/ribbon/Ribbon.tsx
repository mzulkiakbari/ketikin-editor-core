import React from 'react';
import { Editor } from '../../core/Editor';
import { MinimalRibbon } from './MinimalRibbon';
import { FullRibbon } from './FullRibbon';

export type ToolbarStyle = 'minimal' | 'full';

export interface RibbonProps {
    editor: Editor | null;
    toolbarStyle?: ToolbarStyle;
    activeTab?: string;
    setActiveTab?: (tab: string) => void;
    onLayoutClick: () => void;
    onImportClick: () => void;
    onExportClick?: () => void;
    onImageInsertClick?: () => void;
    onLinkClick?: () => void;
    onSymbolClick?: () => void;
    onPageNumberClick?: () => void;
    theme?: 'light' | 'dark';
}

export const Ribbon: React.FC<RibbonProps> = ({
    editor,
    toolbarStyle = 'full',
    onLayoutClick,
    onImportClick,
    onExportClick,
    onImageInsertClick,
    onLinkClick,
    onSymbolClick,
    onPageNumberClick,
    theme = 'dark'
}) => {
    if (toolbarStyle === 'minimal') {
        return (
            <MinimalRibbon
                editor={editor}
                onLayoutClick={onLayoutClick}
                onImportClick={onImportClick}
                onExportClick={onExportClick}
                onImageInsertClick={onImageInsertClick}
                onLinkClick={onLinkClick}
                onSymbolClick={onSymbolClick}
                onPageNumberClick={onPageNumberClick}
                theme={theme}
            />
        );
    }

    return (
        <FullRibbon
            editor={editor}
            onLayoutClick={onLayoutClick}
            onImportClick={onImportClick}
            onExportClick={onExportClick}
            onImageInsertClick={onImageInsertClick}
            onLinkClick={onLinkClick}
            onSymbolClick={onSymbolClick}
            onPageNumberClick={onPageNumberClick}
            theme={theme}
        />
    );
};

export { MinimalRibbon, FullRibbon };
