import React, { useState, useEffect } from 'react';
import { DocElement } from '../../types';
import { IconClose, WrapIcon } from '../common/Icons';
import { dialogRowStyle, dialogSelectStyle, dialogInputStyle, dialogBtnStyle } from '../common/Styles';
import { useLocale } from '../../locales';

interface LayoutDialogProps {
    isOpen: boolean;
    onClose: () => void;
    element: DocElement | null;
    onUpdate: (props: Partial<DocElement>) => void;
}

export const LayoutDialog: React.FC<LayoutDialogProps> = ({ isOpen, onClose, element, onUpdate }) => {
    const locale = useLocale();
    const [activeTab, setActiveTab] = useState<'Position' | 'Text Wrapping' | 'Size'>('Size');
    const [localProps, setLocalProps] = useState<Partial<DocElement>>({});

    useEffect(() => {
        if (element) setLocalProps({ ...element });
    }, [element, isOpen]);

    if (!isOpen || !element) return null;

    const handleApply = () => {
        onUpdate(localProps);
        onClose();
    };

    const updateNested = (path: string, value: any) => {
        const parts = path.split('.');
        const newProps = { ...localProps } as any;
        let current = newProps;
        for (let i = 0; i < parts.length - 1; i++) {
            current[parts[i]] = { ...(current[parts[i]] || {}) };
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
        setLocalProps(newProps);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Position':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <div style={{ fontWeight: '600', marginBottom: '8px', fontSize: '13px' }}>{locale.dialogs.horizontal}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '8px', alignItems: 'center' }}>
                                <label style={{ fontSize: '12px' }}>{locale.dialogs.alignment}</label>
                                <select style={dialogSelectStyle} value={localProps.imagePosition?.horizontal?.value || 0} onChange={(e) => updateNested('imagePosition.horizontal.value', parseFloat(e.target.value))}>
                                    <option value="0">{locale.dialogs.left}</option>
                                    <option value="1">{locale.dialogs.centered}</option>
                                    <option value="2">{locale.dialogs.right}</option>
                                </select>
                                <div style={{ fontSize: '12px', color: '#666' }}>{locale.dialogs.relativeToColumn}</div>
                            </div>
                        </div>
                        <div>
                            <div style={{ fontWeight: '600', marginBottom: '8px', fontSize: '13px' }}>{locale.dialogs.vertical}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr 1fr', gap: '8px', alignItems: 'center' }}>
                                <label style={{ fontSize: '12px' }}>{locale.dialogs.alignment}</label>
                                <select style={dialogSelectStyle} value={localProps.imagePosition?.vertical?.value || 0} onChange={(e) => updateNested('imagePosition.vertical.value', parseFloat(e.target.value))}>
                                    <option value="0">{locale.dialogs.top}</option>
                                    <option value="1">{locale.dialogs.centered}</option>
                                    <option value="2">{locale.dialogs.bottom}</option>
                                </select>
                                <div style={{ fontSize: '12px', color: '#666' }}>{locale.dialogs.relativeToPage}</div>
                            </div>
                        </div>
                    </div>
                );
            case 'Text Wrapping':
                const wrapping = localProps.imageWrapping || 'topBottom';
                const options = [
                    { id: 'inline', label: locale.dialogs.inLineWithText },
                    { id: 'square', label: locale.dialogs.square },
                    { id: 'tight', label: locale.dialogs.tight },
                    { id: 'through', label: locale.dialogs.through },
                    { id: 'topBottom', label: locale.dialogs.topAndBottom },
                    { id: 'behind', label: locale.dialogs.behindText },
                    { id: 'front', label: locale.dialogs.inFrontOfText }
                ];
                return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                        {options.map(opt => (
                            <div key={opt.id} onClick={() => setLocalProps({ ...localProps, imageWrapping: opt.id as any })} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', padding: '8px', borderRadius: '4px', border: wrapping === opt.id ? '2px solid #185abd' : '1px solid #d2d0ce', backgroundColor: wrapping === opt.id ? '#f3f9ff' : 'white' }}>
                                <WrapIcon />
                                <div style={{ fontSize: '11px', textAlign: 'center', marginTop: '4px' }}>{opt.label}</div>
                            </div>
                        ))}
                    </div>
                );
            case 'Size':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                            <div style={{ fontWeight: '600', marginBottom: '10px', fontSize: '13px' }}>{locale.dialogs.sizeAndRotate}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '120px 100px 100px', gap: '15px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '12px' }}>{locale.dialogs.height}</label>
                                    <div style={dialogRowStyle}><input type="number" style={dialogInputStyle} value={Math.round(localProps.imageHeight || 0)} onChange={(e)=>setLocalProps({...localProps, imageHeight: parseInt(e.target.value)})}/> <span style={{fontSize:'12px'}}>px</span></div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '12px' }}>{locale.dialogs.width}</label>
                                    <div style={dialogRowStyle}><input type="number" style={dialogInputStyle} value={Math.round(localProps.imageWidth || 0)} onChange={(e)=>setLocalProps({...localProps, imageWidth: parseInt(e.target.value)})}/> <span style={{fontSize:'12px'}}>px</span></div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '12px' }}>{locale.dialogs.rotation}</label>
                                    <div style={dialogRowStyle}><input type="number" style={dialogInputStyle} value={Math.round(localProps.imageRotation || 0)} onChange={(e)=>setLocalProps({...localProps, imageRotation: parseInt(e.target.value)})}/> <span style={{fontSize:'12px'}}>°</span></div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div style={{ fontWeight: '600', marginBottom: '10px', fontSize: '13px' }}>{locale.dialogs.scale}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '120px 100px 100px', gap: '15px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '12px' }}>{locale.dialogs.height}</label>
                                    <div style={dialogRowStyle}><input type="number" style={dialogInputStyle} defaultValue="100"/> <span style={{fontSize:'12px'}}>%</span></div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <label style={{ fontSize: '12px' }}>{locale.dialogs.width}</label>
                                    <div style={dialogRowStyle}><input type="number" style={dialogInputStyle} defaultValue="100"/> <span style={{fontSize:'12px'}}>%</span></div>
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}><input type="checkbox" checked={localProps.imageSizeOptions?.lockAspectRatio} onChange={(e) => updateNested('imageSizeOptions.lockAspectRatio', e.target.checked)}/> {locale.dialogs.lockAspectRatio}</label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}><input type="checkbox" checked={localProps.imageSizeOptions?.relativeToOriginalSize} onChange={(e) => updateNested('imageSizeOptions.relativeToOriginalSize', e.target.checked)}/> {locale.dialogs.relativeToOriginalSize}</label>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    const tabs: Array<{ id: 'Position' | 'Text Wrapping' | 'Size', label: string }> = [
        { id: 'Position', label: locale.dialogs.positionTab },
        { id: 'Text Wrapping', label: locale.dialogs.textWrappingTab },
        { id: 'Size', label: locale.dialogs.sizeTab },
    ];

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
            <div style={{ backgroundColor: 'white', width: '560px', borderRadius: '4px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee' }}>
                    <span style={{ fontSize: '16px', fontWeight: '500', color: '#323130' }}>{locale.dialogs.layoutTitle}</span>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px' }}><IconClose/></button>
                </div>
                <div style={{ display: 'flex', borderBottom: '1px solid #eee' }}>
                    {tabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '10px 20px', fontSize: '13px', background: 'transparent', border: 'none', borderBottom: activeTab === tab.id ? '2px solid #185abd' : '2px solid transparent', color: activeTab === tab.id ? '#185abd' : '#605e5c', cursor: 'pointer', fontWeight: activeTab === tab.id ? '600' : 'normal' }}>{tab.label}</button>
                    ))}
                </div>
                <div style={{ padding: '24px', flex: 1, minHeight: '300px' }}>
                    {renderTabContent()}
                </div>
                <div style={{ padding: '16px', display: 'flex', justifyContent: 'flex-end', gap: '10px', backgroundColor: '#f8f8f8', borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px' }}>
                    <button onClick={handleApply} style={dialogBtnStyle}>{locale.dialogs.ok}</button>
                    <button onClick={onClose} style={{ ...dialogBtnStyle, backgroundColor: 'white', color: '#323130', border: '1px solid #d2d0ce' }}>{locale.dialogs.cancel}</button>
                </div>
            </div>
        </div>
    );
};
