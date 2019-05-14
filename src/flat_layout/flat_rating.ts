import { IQuestion, ItemValue, QuestionRatingModel } from 'survey-core';
import { FlatRadiogroup } from './flat_radiogroup';
import { FlatRepository } from './flat_repository';
import { IPoint, DocController } from "../doc_controller";
import { IPdfBrick } from '../pdf_render/pdf_brick';
import { CompositeBrick } from '../pdf_render/pdf_composite';
import { SurveyHelper } from '../helper_survey';

export class FlatRating extends FlatRadiogroup {
    protected questionRating: QuestionRatingModel;
    constructor(question: IQuestion, protected controller: DocController) {
        super(question, controller);
        this.questionRating = <QuestionRatingModel>question;
    }
    private generateFlatItem(point: IPoint, index: number, item: ItemValue): IPdfBrick {
        let itemText: string = SurveyHelper.getRatingItemText(
            this.questionRating, index, SurveyHelper.getLocString(item.locText));
        let compositeFlat: CompositeBrick = new CompositeBrick(SurveyHelper.
            createBoldTextFlat(point, this.questionRating, this.controller, itemText));
        let textWidth: number = compositeFlat.xRight - compositeFlat.xLeft; 
        if (textWidth < SurveyHelper.getRatingMinWidth()) {
            compositeFlat.xLeft += (SurveyHelper.getRatingMinWidth() - textWidth) / 2.0;
            textWidth = SurveyHelper.getRatingMinWidth();
        }
        else {
            compositeFlat.xLeft += SurveyHelper.measureText().height / 2.0;
            textWidth += SurveyHelper.measureText().height;
        }
        let radioPoint: IPoint = SurveyHelper.createPoint(compositeFlat);
        radioPoint.xLeft = point.xLeft;
        compositeFlat.addBrick(this.createItemBrick(SurveyHelper.createRect(
            radioPoint, textWidth, SurveyHelper.measureText().height), item, index));
        return compositeFlat;
    }
    generateFlatsContent(point: IPoint): IPdfBrick[] {
        let rowsFlats: CompositeBrick[] = new Array<CompositeBrick>();
        rowsFlats.push(new CompositeBrick());
        let currPoint: IPoint = SurveyHelper.clone(point);
        for (var i = 0; i < this.questionRating.visibleRateValues.length; i++) {
            let itemFlat: IPdfBrick = this.generateFlatItem(currPoint, i,
                this.questionRating.visibleRateValues[i]);
            rowsFlats[rowsFlats.length - 1].addBrick(itemFlat);
            let leftWidth: number = this.controller.paperWidth -
            this.controller.margins.marginRight - itemFlat.xRight;
            if (SurveyHelper.getRatingMinWidth() <= leftWidth + SurveyHelper.EPSILON) {
                currPoint.xLeft = itemFlat.xRight;
            }
            else {
                currPoint.xLeft = point.xLeft;
                currPoint.yTop = itemFlat.yBot;
                if (i !== this.questionRating.visibleRateValues.length - 1) {
                    rowsFlats.push(new CompositeBrick());
                }
            }
          }
        return rowsFlats;
    }
}

FlatRepository.getInstance().register('rating', FlatRating);