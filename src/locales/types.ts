export interface RibbonLocale {
  undo: string;
  redo: string;
  bold: string;
  italic: string;
  underline: string;
  fontTypography: string;
  fontFamily: string;
  fontSize: string;
  fontColor: string;
  highlight: string;
  strikethrough: string;
  subscript: string;
  superscript: string;
  clearFormatting: string;
  paragraph: string;
  textAlignment: string;
  alignLeft: string;
  alignCenter: string;
  alignRight: string;
  alignJustify: string;
  lineSpacing: string;
  insert: string;
  insertElement: string;
  importDoc: string;
  importDocSubtitle: string;
  insertImage: string;
  insertImageSubtitle: string;
  pageLayout: string;
  findReplace: string;
  findPlaceholder: string;
  replacePlaceholder: string;
  find: string;
  replaceAll: string;
  found: string;
  notFound: string;
  replacedCount: string; // e.g. "Mengganti {count} kata"
  bulletList?: string;
  numberList?: string;
  increaseIndent?: string;
  decreaseIndent?: string;
  firstLineIndent?: string;
  styles?: string;
  styleNormal?: string;
  styleTitle?: string;
  styleHeading1?: string;
  styleHeading2?: string;
  styleHeading3?: string;
  styleQuote?: string;
  margins?: string;
  marginThesis?: string;
  marginThesisAlt?: string;
  marginNormal?: string;
  marginNarrow?: string;
  paperSize?: string;
  orientation?: string;
  portrait?: string;
  landscape?: string;
  pageBreak?: string;
  horizontalRule?: string;
  link?: string;
  symbol?: string;
  pageNumber?: string;
}

export interface ContextMenuLocale {
  askAi: string;
  fixGrammar: string;
  continueWriting: string;
  copy: string;
  cut: string;
  paste?: string;
  selectAll?: string;
}

export interface FooterLocale {
  pageStats: string; // e.g. "Halaman {current} dari {total}" / "Page {current} of {total}"
  wordStats: string; // e.g. "{count} kata" / "{count} words"
}

export interface DialogsLocale {
  layoutTitle: string;
  positionTab: string;
  textWrappingTab: string;
  sizeTab: string;
  horizontal: string;
  vertical: string;
  alignment: string;
  left: string;
  centered: string;
  right: string;
  top: string;
  bottom: string;
  relativeToColumn: string;
  relativeToPage: string;
  inLineWithText: string;
  square: string;
  tight: string;
  through: string;
  topAndBottom: string;
  behindText: string;
  inFrontOfText: string;
  sizeAndRotate: string;
  height: string;
  width: string;
  rotation: string;
  scale: string;
  lockAspectRatio: string;
  relativeToOriginalSize: string;
  ok: string;
  cancel: string;
  layoutOptions: string;
  withTextWrapping: string;
  seeMore: string;
  insertImageTitle: string;
  localFileTab: string;
  fromUrlTab: string;
  stockImagesTab: string;
  selectImagePrompt: string;
  chooseFileBtn: string;
  pasteLinkPrompt: string;
  insertBtn: string;
  documentSaved: string;
}

export interface EditorLocale {
  ribbon: RibbonLocale;
  contextMenu: ContextMenuLocale;
  footer: FooterLocale;
  dialogs: DialogsLocale;
}

export type SupportedLocale = 'id' | 'en';

// Nested partial for easy injection
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type LocaleInput = SupportedLocale | DeepPartial<EditorLocale>;
