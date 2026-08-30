import React from 'react';
import { DocElement } from '../../types';
import { IconClose, WrapIcon } from '../common/Icons';
import { useLocale } from '../../locales';

interface LayoutOptionsPopupProps {
    isOpen: boolean;
    onClose: () => void;
    anchorRect: { x: number; y: number; width: number; height: number; pageIdx: number } | null;
    element: DocElement | null;
    onUpdate: (props: Partial<DocElement>) => void;
}

export const LayoutOptionsPopup: React.FC<LayoutOptionsPopupProps> = ({ isOpen, onClose, anchorRect, element, onUpdate }) => {
    const locale = useLocale();

    if (!isOpen || !anchorRect || !element) return null;

    const currentWrapping = element.imageWrapping || 'topBottom';
    const options = [
        { id: 'inline', label: locale.dialogs.inLineWithText },
        { id: 'square', label: locale.dialogs.square },
        { id: 'tight', label: locale.dialogs.tight },
        { id: 'through', label: locale.dialogs.through },
        { id: 'topBottom', label: locale.dialogs.topAndBottom },
        { id: 'behind', label: locale.dialogs.behindText },
        { id: 'front', label: locale.dialogs.inFrontOfText }
    ];

    const posX = anchorRect.x + anchorRect.width + 10;
    const posY = anchorRect.y;

    return (
        <div className="ketikin-editor-ui" style={{
            position: 'absolute', left: `${posX}px`, top: `${posY}px`, width: '180px', backgroundColor: 'white', borderRadius: '4px', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', zIndex: 2000, padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#323130' }}>{locale.dialogs.layoutOptions}</span>
                <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}><IconClose/></button>
            </div>
            <div style={{ fontSize: '11px', color: '#605e5c', marginBottom: '8px' }}>{locale.dialogs.withTextWrapping}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {options.map(opt => (
                    <button key={opt.id} onClick={() => onUpdate({ imageWrapping: opt.id as any })} title={opt.label} style={{ background: currentWrapping === opt.id ? '#f3f9ff' : 'white', border: currentWrapping === opt.id ? '2px solid #185abd' : '1px solid #d2d0ce', borderRadius: '4px', padding: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <WrapIcon />
                    </button>
                ))}
            </div>
            <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid #eee' }}>
                <button style={{ background: 'transparent', border: 'none', color: '#185abd', fontSize: '11px', padding: 0, cursor: 'pointer' }}>{locale.dialogs.seeMore}</button>
            </div>
        </div>
    );
};
