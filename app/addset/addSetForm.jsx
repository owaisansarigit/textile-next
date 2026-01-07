// const emptyForm = {
//   sizing: "",
//   setNo: "",
//   date: new Date().toISOString().split("T")[0],
//   ends: 0,
//   tl: 0,
//   yarnId: "",
//   yarnCount: 40,
//   yarnCategory: "",
//   bagName: "",
//   bagsUsed: 0,
//   weightPerBag: 0,
//   yarnWeight: 0,
//   usedYarnWeight: 0,
//   totalCuts: 0,
//   totalBeams: 0,
//   openingBalance: 0,
//   closingBalance: 0,
//   beamDetails: [],
// };
import React, { useState, useEffect, useMemo } from "react";
import { sizingService, yarnService, ledgerService } from "../../db/dbServices";
import SetHeaderSection from "./setFormComps/SetHeaderSection";
import YarnSection from "./setFormComps/YarnSection";
import BeamCountSection from "./setFormComps/BeamCountSection";
import BeamDetailsTable from "./setFormComps/BeamDetailsTable";
import SaveButton from "./setFormComps/SaveButton";

const emptyForm = {
  sizing: "",
  setNo: "",
  date: new Date().toISOString().split("T")[0],
  ends: "",
  tl: "",
  yarnId: "",
  yarnCount: "",
  yarnCategory: "",
  bagName: "",
  bagsUsed: 0,
  weightPerBag: 0,
  yarnWeight: 0,
  actualCount: 0,
  usedYarnWeight: 0,
  totalCuts: 0,
  totalBeams: 0,
  openingBalance: 0,
  closingBalance: 0,
  beamDetails: [],
};

const AddSetForm = () => {
  const [form, setForm] = useState(emptyForm);
  const [beams, setBeams] = useState([]);
  const [suggestions, setSuggestions] = useState({
    sizing: [],
    weaver: [],
    yarnNames: [],
  });
  const [openingBalance, setOpeningBalance] = useState(0);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);

  // Load suggestions
  useEffect(() => {
    const load = async () => {
      const [sizings, weavers, yarns] = await Promise.all([
        sizingService.getAllSizings(),
        ledgerService.getAll(),
        yarnService.getAll(),
      ]);
      setSuggestions({
        sizing: sizings.map((s) => s.name),
        weaver: weavers.map((w) => w.name || w.alias || w.id),
        yarnNames: yarns.map((y) => y.name || `${y.count} ${y.category}`),
      });
    };
    load();
  }, []);

  // Auto-fill yarn count & category when bagName (yarn name) is selected
  useEffect(() => {
    const autoFillYarn = async () => {
      if (!form.bagName) {
        setForm((prev) => ({
          ...prev,
          yarnCount: "",
          yarnCategory: "",
          yarnId: "",
        }));
        return;
      }
      const yarns = await yarnService.getAll();
      const matched = yarns.find(
        (y) =>
          (y.name && y.name.toLowerCase() === form.bagName.toLowerCase()) ||
          `${y.count} ${y.category}`.toLowerCase() ===
            form.bagName.toLowerCase()
      );
      if (matched) {
        setForm((prev) => ({
          ...prev,
          yarnId: matched.id,
          yarnCount: matched.count,
          yarnCategory: matched.category,
          weightPerBag: matched.bagWeight || 100, // default if not set
        }));
      }
    };
    autoFillYarn();
  }, [form.bagName]);

  // Calculate issued yarn weight
  const issuedWeight = useMemo(() => {
    return (Number(form.bagsUsed) || 0) * (Number(form.weightPerBag) || 0);
  }, [form.bagsUsed, form.weightPerBag]);

  const closingBalance = useMemo(() => {
    const issued =
      (Number(form.bagsUsed) || 0) * (Number(form.weightPerBag) || 0);
    return Number(openingBalance) + issued - (Number(form.usedYarnWeight) || 0);
  }, [openingBalance, form.bagsUsed, form.weightPerBag, form.usedYarnWeight]);

  // Update stock balance based on sizing + yarn count + category
  useEffect(() => {
    const updateStock = async () => {
      if (!form.sizing || !form.yarnCount || !form.yarnCategory) {
        setOpeningBalance(0);
        return;
      }
      const sizings = await sizingService.getAllSizings();
      const sizing = sizings.find((s) => s.name.trim() === form.sizing.trim());
      if (!sizing) {
        setOpeningBalance(0);
        return;
      }
      const item = sizing.stock.find(
        (i) => i.count === form.yarnCount && i.category === form.yarnCategory
      );
      if (item) {
        const total =
          item.bagsBalance * (form.weightPerBag || 100) + item.looseBalance;
        setOpeningBalance(total);
      } else {
        setOpeningBalance(0);
      }
    };
    updateStock();
  }, [form.sizing, form.yarnCount, form.yarnCategory, form.weightPerBag]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const buildBeams = (total) => {
    const num = Number(total) || 0;
    const newBeams = Array.from({ length: num }, (_, i) => ({
      beamNo: i + 1,
      cuts: "",
      wLedgerId: "",
      pipeNo: "",
      slipNo: "",
      slipDate: form.date,
    }));
    setBeams(newBeams);
  };

  const updateBeam = (index, field, value) => {
    setBeams((prev) =>
      prev.map((b, i) => (i === index ? { ...b, [field]: value } : b))
    );
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!form.sizing) newErrors.sizing = "Required";
    if (!form.setNo) newErrors.setNo = "Required";
    if (!form.yarnId) newErrors.bagName = "Select valid yarn";
    if (form.bagsUsed <= 0) newErrors.bagsUsed = "Must be > 0";
    if (form.weightPerBag <= 0) newErrors.weightPerBag = "Must be > 0";
    if (form.totalBeams <= 0) newErrors.totalBeams = "Must be > 0";
    if (closingBalance < 0) newErrors.stock = "Insufficient stock";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const sizings = await sizingService.getAllSizings();
      const sizingRec = sizings.find(
        (s) => s.name.trim() === form.sizing.trim()
      );

      const dataToSave = {
        sizingId: sizingRec.id,
        setNo: form.setNo.trim(),
        date: form.date,
        ends: form.ends,
        tl: form.tl,
        yarnId: form.yarnId,
        yarnBags: Number(form.bagsUsed),
        yarnWeight: issuedWeight,
        opBalance: openingBalance,
        closingBalance: closingBalance,
        totalCuts: Number(form.totalCuts),
        totalBeams: Number(form.totalBeams),
        beamDetails: beams.map((b) => ({
          beamNo: b.beamNo,
          cuts: Number(b.cuts || 0),
          wLedgerId: b.wLedgerId,
          pipeNo: b.pipeNo,
          slipNo: b.slipNo,
          slipDate: b.slipDate,
        })),
      };
      console.log("Saving set:", dataToSave);
      // await sizingService.createSet(dataToSave);
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
      setForm(emptyForm);
      setBeams([]);
      setErrors({});
    } catch (err) {
      console.error(err);
      setErrors({ general: "Save failed. Check stock or console." });
    }
  };

  return (
    <div className="container my-4" style={{ maxWidth: "960px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <nav className="text-muted">
          Home / Sets / <span className="text-primary">Add Set</span>
        </nav>
        {saved && (
          <span className="badge bg-success">✔ Saved Successfully</span>
        )}
      </div>

      <SetHeaderSection
        form={form}
        updateField={updateField}
        suggestions={suggestions}
        openingBalance={openingBalance}
        errors={errors}
      />

      <YarnSection
        form={form}
        updateField={updateField}
        suggestions={suggestions}
        issuedWeight={issuedWeight}
        closingBalance={closingBalance}
        errors={errors}
      />

      <BeamCountSection
        form={form}
        updateField={updateField}
        buildBeams={buildBeams}
        errors={errors}
      />

      <BeamDetailsTable
        beams={beams}
        updateBeam={updateBeam}
        suggestions={suggestions}
        date={form.date}
      />

      {errors.general && (
        <div className="alert alert-danger mt-3">{errors.general}</div>
      )}
      {errors.stock && (
        <div className="alert alert-warning mt-3">{errors.stock}</div>
      )}

      <SaveButton onSave={handleSave} />
    </div>
  );
};

export default AddSetForm;
