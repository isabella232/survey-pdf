import { IPdfBrick, PdfBrick } from './pdf_brick';
import { SurveyHelper } from '../helper_survey';

export class ComposeBrick implements IPdfBrick {
    private pdfBricks: IPdfBrick[];
    xLeft: number;
    xRight: number;
    yTop: number;
    yBot: number;
    constructor(...pdfBricks: IPdfBrick[]) {
        this.pdfBricks = pdfBricks;
        let mergeRect = SurveyHelper.mergeRects(...pdfBricks);
        this.xLeft = mergeRect.xLeft;
        this.xRight = mergeRect.xRight;
        this.yTop = mergeRect.yTop;
        this.yBot = mergeRect.yBot;

    }
    render(): void {
        this.pdfBricks.forEach((pdfBrick: IPdfBrick) => {
            pdfBrick.render();
        });
    }
} 