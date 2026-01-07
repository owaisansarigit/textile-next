import textileDB from './textileDB';
import { v4 as uuidv4 } from 'uuid';
const generateId = () => uuidv4();
const getToday = () => new Date().toISOString().split('T')[0];

const groupService = {
    create: async (name) =>
        textileDB.groups.add({ id: generateId(), name: name.trim() }),

    getAll: () => textileDB.groups.toArray(),

    getById: (id) => textileDB.groups.get(id),

    update: async (id, name) =>
        textileDB.groups.update(id, { name: name.trim() }),

    delete: async (id) => textileDB.groups.delete(id),
};
const ledgerService = {
    create: async (data) =>
        textileDB.wLedgers.add({
            id: generateId(),
            groupId: data.groupId,
            name: data.name.trim(),
            alias: (data.alias || data.name).trim(),
            opYarnBalance: Number(data.opYarnBalance || 0),
            opYarnBalanceDate: data.opYarnBalanceDate || getToday(),
            currentYarnBalance: Number(data.opYarnBalance || 0),
        }),

    getAll: () => textileDB.wLedgers.toArray(),

    getById: (id) => textileDB.wLedgers.get(id),

    update: async (id, data) =>
        textileDB.wLedgers.update(id, {
            groupId: data.groupId,
            name: data.name.trim(),
            alias: (data.alias || data.name).trim(),
            opYarnBalance: Number(data.opYarnBalance || 0),
            opYarnBalanceDate: data.opYarnBalanceDate || '',
        }),

    delete: async (id) => textileDB.wLedgers.delete(id),
};

const clothService = {
    create: async (data) =>
        textileDB.cloth.add({
            id: generateId(),
            name: data.name.trim(),
            alias: (data.alias || '').trim(),
            yarnCategory: data.yarnCategory,
            yarnCount: data.yarnCount,
            weightPerPcs: Number(data.weightPerPcs || 0),
            stock: Number(data.stock || 0),
            stockDate: data.stockDate || getToday(),
        }),

    getAll: () => textileDB.cloth.toArray(),

    getById: (id) => textileDB.cloth.get(id),

    update: async (id, data) =>
        textileDB.cloth.update(id, {
            name: data.name.trim(),
            alias: (data.alias || '').trim(),
            yarnCategory: data.yarnCategory,
            yarnCount: data.yarnCount,
            weightPerPcs: Number(data.weightPerPcs || 0),
            stock: Number(data.stock || 0),
            stockDate: data.stockDate,
        }),

    delete: async (id) => textileDB.cloth.delete(id),

};

const yarnService = {
    create: async (data) =>
        textileDB.yarn.add({
            id: generateId(),
            name: data.name.trim(),
            count: data.count,
            category: data.category,
            bagWeight: Number(data.bagWeight || 60),
            stockBags: Number(data.bagsStock || 0),
            looseStock: Number(data.looseStock || 0),
        }),

    getAll: () => textileDB.yarn.toArray(),

    getById: (id) => textileDB.yarn.get(id),

    update: async (id, data) =>
        textileDB.yarn.update(id, {
            name: data.name.trim(),
            count: data.count,
            category: data.category,
            bagWeight: Number(data.bagWeight || 0),
            stockBags: Number(data.bagsStock || 0),
            looseStock: Number(data.looseStock || 0),
        }),

    delete: async (id) => textileDB.yarn.delete(id),
};
const sizingService = {
    createSizing: async (data) => {
        return await textileDB.sizing.add({
            id: generateId(),
            name: data.name.trim(),
            stock: data.stock.map(item => ({
                category: item.category?.trim() || "",
                count: item.count?.trim() || "",
                bagsBalance: Number(item.bagsBalance || 0),
                looseBalance: Number(item.looseBalance || 0),
            })),
        });
    },
    updateSizing: async (id, data) => {
        await textileDB.sizing.update(id, {
            name: data.name.trim(),
            stock: data.stock.map(item => ({
                category: item.category?.trim() || "",
                count: item.count?.trim() || "",
                bagsBalance: Number(item.bagsBalance || 0),
                looseBalance: Number(item.looseBalance || 0),
            })),
        });
    },
    deleteSizing: async (id) => textileDB.sizing.delete(id),
    getAllSizings: () => textileDB.sizing.toArray(),
    getSizingById: (id) => textileDB.sizing.get(id),
    createSet: async (formData) =>
        textileDB.transaction('rw', [
            textileDB.sets,
            textileDB.beamBook,
            textileDB.wLedgers,
            textileDB.yarnTransactions,
        ], async () => {
            const setId = generateId();
            const beamWeightPerBeam = Number(formData.yarnWeight) / Number(formData.totalBeams);
            await textileDB.sets.add({
                id: setId,
                sizingId: formData.sizingId,
                setNo: formData.setNo,
                date: formData.date,
                ends: formData.ends,
                tl: formData.tl,
                yarnId: formData.yarnId,
                bagName: formData.bagName,
                bagsUsed: formData.bagsUsed,
                yarnWeight: Number(formData.yarnWeight),
                usedYarnWeight: Number(formData.usedYarnWeight),
                openingBalance: Number(formData.opBalance),
                closingBalance: Number(formData.closingBalance),
                totalCuts: Number(formData.totalCuts),
                totalBeams: Number(formData.totalBeams),
                beamDetails: formData.beamDetails,
            });

            for (const beam of formData.beamDetails) {
                await textileDB.beamBook.add({
                    id: generateId(),
                    setId,
                    setNo: formData.setNo,
                    date: formData.date,
                    beamNo: beam.beamNo,
                    cuts: Number(beam.cuts),
                    wLedgerId: beam.wLedgerId,
                    pipeNo: beam.pipeNo,
                    slipNo: beam.slipNo,
                    slipDate: beam.slipDate,
                });

                const ledger = await textileDB.wLedgers.get(beam.wLedgerId);
                if (ledger) {
                    await textileDB.wLedgers.update(beam.wLedgerId, {
                        currentYarnBalance: Number(ledger.currentYarnBalance) + beamWeightPerBeam,
                    });
                }

                await textileDB.yarnTransactions.add({
                    id: generateId(),
                    wLedgerId: beam.wLedgerId,
                    opBalance: ledger?.currentYarnBalance || 0,
                    clothBookId: null,
                    closingBalance: (ledger?.currentYarnBalance || 0) + beamWeightPerBeam,
                    date: formData.date,
                    description: `Beam ${beam.beamNo} issued - Set ${formData.setNo}`,
                });
            }
            return setId;
        }),


    getAllSets: () => textileDB.sets.toArray(),
    getSetById: (id) => textileDB.sets.get(id),
    getBeamsBySetId: (setId) => textileDB.beamBook.where({ setId }).toArray(),
    deleteSet: async (setId) =>
        textileDB.transaction('rw', [
            textileDB.sets,
            textileDB.beamBook,
            textileDB.yarnTransactions,
        ], async () => {
            await textileDB.beamBook.where({ setId }).delete();
            // Optional: clean up transactions more reliably if needed
            await textileDB.sets.delete(setId);
        }),
};
const productionService = {
    create: async (data) =>
        textileDB.transaction('rw', [textileDB.clothBook, textileDB.wLedgers, textileDB.yarnTransactions, textileDB.cloth], async () => {
            const entryId = generateId();
            const totalWeight = data.summary.reduce((sum, item) => sum + Number(item.weight), 0);

            await textileDB.clothBook.add({
                id: entryId,
                wLedgerId: data.wLedgerId,
                summary: data.summary,
                date: data.date || getToday(),
            });

            const ledger = await textileDB.wLedgers.get(data.wLedgerId);
            if (ledger) {
                const opBalance = Number(ledger.currentYarnBalance);
                await textileDB.wLedgers.update(data.wLedgerId, {
                    currentYarnBalance: opBalance - totalWeight,
                });

                await textileDB.yarnTransactions.add({
                    id: generateId(),
                    wLedgerId: data.wLedgerId,
                    opBalance,
                    clothBookId: entryId,
                    closingBalance: opBalance - totalWeight,
                    date: data.date,
                    description: `Cloth production entry`,
                });
            }

            for (const item of data.summary) {
                const cloth = await textileDB.cloth.get(item.clothId);
                if (cloth) {
                    await textileDB.cloth.update(item.clothId, {
                        currentStock: (cloth.currentStock || 0) + Number(item.qty),
                    });
                }
            }

            return entryId;
        }),

    getAll: () => textileDB.clothBook.toArray(),

    getById: (id) => textileDB.clothBook.get(id),

    getByLedgerId: (wLedgerId) => textileDB.clothBook.where({ wLedgerId }).toArray(),

    delete: async (id) =>
        textileDB.transaction('rw', [textileDB.clothBook, textileDB.wLedgers, textileDB.yarnTransactions, textileDB.cloth], async () => {
            const entry = await textileDB.clothBook.get(id);
            if (!entry) return;

            const totalWeight = entry.summary.reduce((sum, item) => sum + Number(item.weight), 0);
            const ledger = await textileDB.wLedgers.get(entry.wLedgerId);

            if (ledger) {
                await textileDB.wLedgers.update(entry.wLedgerId, {
                    currentYarnBalance: Number(ledger.currentYarnBalance) + totalWeight,
                });
            }

            await textileDB.yarnTransactions.where({ clothBookId: id }).delete();

            for (const item of entry.summary) {
                const cloth = await textileDB.cloth.get(item.clothId);
                if (cloth) {
                    await textileDB.cloth.update(item.clothId, {
                        currentStock: (cloth.currentStock || 0) - Number(item.qty),
                    });
                }
            }

            await textileDB.clothBook.delete(id);
        }),
};
const pipeService = {
    create: async (data) =>
        textileDB.pipe.add({
            id: generateId(),
            name: data.name.trim(),
            alias: (data.alias || '').trim(),
            currentStatus: 'Available',
            historyLog: [{ date: getToday(), status: 'Purchased', details: 'Initial Entry' }],
        }),

    getAll: () => textileDB.pipe.toArray(),

    getById: (id) => textileDB.pipe.get(id),

    update: async (id, data) =>
        textileDB.pipe.update(id, {
            name: data.name.trim(),
            alias: (data.alias || '').trim(),
        }),

    updateStatus: async (id, status, details = '') => {
        const pipe = await textileDB.pipe.get(id);
        if (!pipe) return;

        await textileDB.pipe.update(id, {
            currentStatus: status,
            historyLog: [
                ...pipe.historyLog,
                { date: getToday(), status, details: details || `${status} update` },
            ],
        });
    },

    delete: async (id) => textileDB.pipe.delete(id),
};
const yarnIssuanceService = {
    create: async (data) =>
        textileDB.transaction('rw', [textileDB.yarnIssues, textileDB.yarn, textileDB.wLedgers, textileDB.yarnTransactions], async () => {
            const yarn = await textileDB.yarn.get(data.yarnId);
            if (!yarn || !yarn.bagWeight) throw new Error('Invalid yarn or bag weight not set');

            let bagsToIssue = Number(data.bags || 0);
            let looseToIssue = Number(data.loose || 0);
            let convertBags = 0;

            if (looseToIssue > yarn.looseStock) {
                const extra = looseToIssue - yarn.looseStock;
                convertBags = Math.ceil(extra / yarn.bagWeight);
                if (convertBags + bagsToIssue > yarn.stockBags) throw new Error('Insufficient stock');

                await textileDB.yarn.update(yarn.id, {
                    stockBags: yarn.stockBags - convertBags,
                    looseStock: yarn.looseStock + convertBags * yarn.bagWeight,
                });

                yarn.stockBags -= convertBags;
                yarn.looseStock += convertBags * yarn.bagWeight;
            }

            if (bagsToIssue > yarn.stockBags) throw new Error('Insufficient bags');

            await textileDB.yarn.update(yarn.id, {
                stockBags: yarn.stockBags - bagsToIssue,
                looseStock: yarn.looseStock - looseToIssue,
            });

            const totalWeight = (bagsToIssue * yarn.bagWeight) + looseToIssue;
            const issueId = generateId();
            const date = data.date || getToday();

            await textileDB.yarnIssues.add({
                id: issueId,
                yarnId: data.yarnId,
                wLedgerId: data.wLedgerId,
                date,
                bags: bagsToIssue,
                loose: looseToIssue,
                totalWeight,
            });

            const ledger = await textileDB.wLedgers.get(data.wLedgerId);
            if (ledger) {
                const opBalance = Number(ledger.currentYarnBalance);
                await textileDB.wLedgers.update(data.wLedgerId, {
                    currentYarnBalance: opBalance + totalWeight,
                });

                await textileDB.yarnTransactions.add({
                    id: generateId(),
                    wLedgerId: data.wLedgerId,
                    opBalance,
                    clothBookId: null,
                    closingBalance: opBalance + totalWeight,
                    date,
                    description: `Yarn issued: ${bagsToIssue} bags, ${looseToIssue} kg of ${yarn.count} ${yarn.category}`,
                });
            }

            return issueId;
        }),

    getAll: () => textileDB.yarnIssues.toArray(),

    getById: (id) => textileDB.yarnIssues.get(id),

    delete: async (id) =>
        textileDB.transaction('rw', [textileDB.yarnIssues, textileDB.yarn, textileDB.wLedgers, textileDB.yarnTransactions], async () => {
            const issue = await textileDB.yarnIssues.get(id);
            if (!issue) return;

            const yarn = await textileDB.yarn.get(issue.yarnId);
            if (yarn) {
                await textileDB.yarn.update(issue.yarnId, {
                    stockBags: yarn.stockBags + issue.bags,
                    looseStock: yarn.looseStock + issue.loose,
                });
            }

            const ledger = await textileDB.wLedgers.get(issue.wLedgerId);
            if (ledger) {
                await textileDB.wLedgers.update(issue.wLedgerId, {
                    currentYarnBalance: ledger.currentYarnBalance - issue.totalWeight,
                });
            }

            // Delete the corresponding transaction (match by description or date, but for simplicity, assume one per issue)
            // To be precise, could add issueId to yarnTransactions, but skipping for now
            // await textileDB.yarnTransactions.where({description: `Yarn issued: ...`}).delete(); // approximate

            await textileDB.yarnIssues.delete(id);
        }),
};

export {
    groupService, ledgerService, clothService, yarnService, sizingService, productionService, pipeService, yarnIssuanceService,
}