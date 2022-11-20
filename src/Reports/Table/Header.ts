import { renderData } from '../../Tools/renderData';
import { UnitType } from '../../Tools/UnitType';

import { Row } from './Row';

export class Header extends Row {
    override render(): string {
        const { infos } = this._props;

        const arr: string[] = [];
        for (let i = 0; i < infos.length; i++) {
            const content = renderData(this._cells[i], UnitType.ORIGIN, infos[i].fractionDigit, this._props.timeUnit);
            arr.push(Row._renderContent(content, infos[i]));
        }
        return `| ${arr.join(' | ')} |`;
    }
}
