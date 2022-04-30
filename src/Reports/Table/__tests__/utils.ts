import { UnitType } from '../../../Tools/UnitType';
import { ColumnInfo, createColumnInfo } from '../ColumnInfo';
import { ColumnAlign } from '../types';

export function createColumnInfos() {
    const infos: ColumnInfo[] = [
        createColumnInfo(ColumnAlign.RIGHT, UnitType.Origin),
        createColumnInfo(ColumnAlign.MEDIUM, UnitType.Dimensionless),
        createColumnInfo(ColumnAlign.LEFT, UnitType.Time),
        createColumnInfo(ColumnAlign.RIGHT, UnitType.Origin),
        createColumnInfo(ColumnAlign.MEDIUM, UnitType.Dimensionless),
        createColumnInfo(ColumnAlign.LEFT, UnitType.Time),
        createColumnInfo(ColumnAlign.RIGHT, UnitType.Origin),
        createColumnInfo(ColumnAlign.MEDIUM, UnitType.Dimensionless),
        createColumnInfo(ColumnAlign.LEFT, UnitType.Time),
    ];

    infos[1].fractionDigit = 3;
    infos[2].fractionDigit = 3;
    infos[4].fractionDigit = 3;
    infos[5].fractionDigit = 3;
    infos[7].fractionDigit = 3;
    infos[8].fractionDigit = 3;

    infos[3].width = 5;
    infos[4].width = 5;
    infos[5].width = 5;
    infos[6].width = 10;
    infos[7].width = 10;
    infos[8].width = 10;

    return infos;
}
