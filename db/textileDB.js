import Dexie from 'dexie';
const textileDB = new Dexie('TextileManagementDB');
const schemas = {
    groups: '++id, &name',
    wLedgers: '++id, groupId, &name, alias,opYarnBalance,opYarnBalanceDate,currentYarnBalance',
    sizing: 'id, &name',
    yarn: '++id,name, count, category, bagWeight, stockBags, looseStock',
    cloth: '++id, &name, alias, yarnCategory,yarnCount, weightPerPcs, stock, stockDate',
    sets: '++id, sizingId, &setNo, date, yarnId,ends, tl, yarnWeight,bagName, bagsUsed, usedYarnWeight, openingBalance, closingBalance, totalCuts, totalBeams, beamDetails',
    beamBook: '++id, setId, wLedgerId, pipeNo, slipNo, date',
    clothBook: '++id, wLedgerId',
    yarnIssues: '++id, wLedgerId, yarnId, date',
    yarnTransactions: '++id, wLedgerId, clothBookId',
    pipe: '++id, &name, alias',
    pipeReceiveds: '++id, wLedgerId, pipeId, slipNo'
};
textileDB.version(1).stores(schemas);
export default textileDB;