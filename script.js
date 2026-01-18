const DOZEN = 12;

/* Case quantities per item */
const CASES = {
    KNORR_AIO: 240,
    KNORR_CHICKEN: 240,
    LIFEBOUY_T_70g: 72,
    LIFEBUOY_L_70g: 72,
    LIFEBUOY_T_20G:144,
    LIFEBUOY_L_20G:144,
    LIFEBUOY_T_150G:36,
    LIFEBUOY_L_150G:36,
    LUX_ST_70G:72,
    LUX_SC_70G:72,
    LUX_ST_150G:36,
    LUX_SC_150G:36,
    SIGNAL_30G:144,
    SIGNAL_60G:72,
    SIGNAL_140G:48,
    SSSHACOC350ML:12,
    SSCONDCOC350ML:12,
    SSSHAAVO350ML:12,
    SSCONDAVO350ML:12,
    SSSHACOC700ML:12,
    SSCONDCOC700ML:12,
    SSSHAAVO700ML:12,
    SSCONDAVO700ML:12,
    SSSHACOC15ML:360,
    SSCONDCOC15ML:360,
    SUNLIGHT_P_40G:100,
    SUNLIGHT_P_90G:72,
    SUNLIGHT_P_500G:24,
    SUNLIGHT_P_1KG:12,
    SUNLIGHT_P_5KG:1,
    OMO40G:100,
    OMO100G:72,
    OMO500G:24,
    OMO1KG:12,
    OMO3KG:4,
    VASELINE_B_45ML:72,
    VASELINE_O_45ML:144,
    VASELINE_B_95ML:48,
    VASELINE_O_95ML:72,
    VASELINE_B_240ML:24,
    VASELINE_O_240ML:24,
    VL_COCOA_200ML:24,
    VL_ALOE_200ML:24,
    VL_DRYSKIN_200ML:24,
    VL_COCOA_400ML:24,
    VL_ALOE_400ML:24,
    VL_DRYSKIN_400ML:24
    
};

/* Price per piece per item (ETB) */
const PRICES = {
    KNORR_AIO: 4.4965,
    KNORR_CHICKEN: 4.4965,
    LIFEBOUY_T_70g: 47.66764427,
    LIFEBOUY_L_70g: 47.66889394,
    LIFEBUOY_T_20G:16.6635,
    LIFEBUOY_L_20G:16.6635,
    LIFEBUOY_T_150G:102.6605,
    LIFEBUOY_L_150G:102.6605,
    LUX_ST_70G:54.5445,
    LUX_SC_70G:54.54833333,
    LUX_ST_150G:108.1115,
    LUX_SC_150G:108.1115,
    SIGNAL_30G:42.9985,
    SIGNAL_60G:69.414,
    SIGNAL_140G:120.0025,
    SSSHACOC350ML:152.812,
    SSCONDCOC350ML:152.812,
    SSSHAAVO350ML:152.812,
    SSCONDAVO350ML:152.812,
    SSSHACOC700ML:269.5025,
    SSCONDCOC700ML:269.5025,
    SSSHAAVO700ML:269.5025,
    SSCONDAVO700ML:269.5025,
    SSSHACOC15ML:7.774,
    SSCONDCOC15ML:7.774,
    SUNLIGHT_P_40G:17.4225,
    SUNLIGHT_P_90G:34.017,
    SUNLIGHT_P_500G:144.54,
    SUNLIGHT_P_1KG:258.85,
    SUNLIGHT_P_5KG:1306.62,
    OMO40G:25.4955,
    OMO100G:39.215,
    OMO500G:169.648,
    OMO1KG:344.54,
    OMO3KG:956.52,
    VASELINE_B_45ML:69.5635,
    VASELINE_O_45ML:78.27,
    VASELINE_B_95ML:143.474,
    VASELINE_O_95ML:152.18,
    VASELINE_B_240ML:304.3475,
    VASELINE_O_240ML:347.83,
    VL_COCOA_200ML:260.866,
    VL_ALOE_200ML:260.866,
    VL_DRYSKIN_200ML:260.866,
    VL_COCOA_400ML:478.262,
    VL_ALOE_400ML:478.262,
    VL_DRYSKIN_400ML:478.262
    
};

/* =====================
   DATE
   ===================== */
const dateDisplay = document.getElementById("dateDisplay");
const datePicker = document.getElementById("datePicker");

const today = new Date();
dateDisplay.value = formatDate(today);
datePicker.valueAsDate = today;

dateDisplay.onclick = () => datePicker.showPicker();
datePicker.oninput = () => {
    dateDisplay.value = formatDate(new Date(datePicker.value));
};

function formatDate(d) {
    return (
        String(d.getDate()).padStart(2, "0") +
        "/" +
        String(d.getMonth() + 1).padStart(2, "0") +
        "/" +
        d.getFullYear()
    );
}

/* =====================
   HELPERS
   ===================== */
function val(row, cls) {
    const v = row.querySelector(cls).value;
    return v === "" ? 0 : parseInt(v, 10);
}

function getCase(row) {
    return CASES[row.cells[0].innerText.trim()] || 72;
}

function getPrice(row) {
    return PRICES[row.cells[0].innerText.trim()] || 0;
}

function animate(el, value) {
    if (!el) return;
    if (el.value !== String(value)) {
        el.classList.remove("sales-animate");
        void el.offsetWidth;
        el.classList.add("sales-animate");
        el.value = value;
    }
}

/* =====================
   Dynamic row selector
   ===================== */
function getRows() {
    return [...document.querySelectorAll("#salesTable tbody tr")];
}

/* =====================
   GRAND TOTAL
   ===================== */
function updateGrandTotal() {
    const grandEl = document.querySelector(".grand-total-etb");
    if (!grandEl) return;
    let sum = 0;

    getRows().forEach(row => {
        const etbEl = row.querySelector(".total-etb");
        const v = etbEl && etbEl.value !== "" ? parseFloat(etbEl.value) : 0;
        sum += isNaN(v) ? 0 : v;
    });

    grandEl.value = sum.toFixed(2); // always show 2 decimals
}


/* =====================
   SALES CALCULATION
   ===================== */
function calculateSales(row) {
    const CASE = getCase(row);

    const issuePCS =
        val(row, ".issue-cz") * CASE +
        val(row, ".issue-dz") * DOZEN +
        val(row, ".issue-pc");

    const returnPCS =
        val(row, ".return-cz") * CASE +
        val(row, ".return-dz") * DOZEN +
        val(row, ".return-pc");

    const pcs = Math.max(issuePCS - returnPCS, 0);

    const cz = Math.floor(pcs / CASE);
    const remAfterCZ = pcs - cz * CASE;
    const dz = Math.floor(remAfterCZ / DOZEN);
    const pc = remAfterCZ - dz * DOZEN;

    animate(row.querySelector(".sales-cz"), cz);
    animate(row.querySelector(".sales-dz"), dz);
    animate(row.querySelector(".sales-pc"), pc);

    row.querySelector(".total-pcs").value = pcs;

/* Total ETB per row with 2 decimals */
const price = getPrice(row);
const totalETB = (pcs * price).toFixed(2); // ensures 2 decimal places
animate(row.querySelector(".total-etb"), totalETB);


    /* Update grand total */
    updateGrandTotal();
}

/* =====================
   VALIDATION + LOCKING
   ===================== */
function update(activeRow) {
    let errorRow = null;

    getRows().forEach(row => {
        const CASE = getCase(row);
        const issue =
            val(row, ".issue-cz") * CASE +
            val(row, ".issue-dz") * DOZEN +
            val(row, ".issue-pc");
        const ret =
            val(row, ".return-cz") * CASE +
            val(row, ".return-dz") * DOZEN +
            val(row, ".return-pc");
        if (ret > issue) errorRow = row;
    });

    getRows().forEach(row => {
        const inputs = row.querySelectorAll("input:not(.readonly)");
        if (errorRow && row !== errorRow) {
            inputs.forEach(i => (i.disabled = true));
        } else {
            inputs.forEach(i => (i.disabled = false));
        }
        row.classList.remove("error-row");
        row.querySelectorAll(".readonly").forEach(i =>
            i.classList.remove("error-glow")
        );
    });

    if (errorRow) {
        errorRow.classList.add("error-row");
        errorRow.querySelectorAll(".readonly").forEach(i =>
            i.classList.add("error-glow")
        );
        updateGrandTotal();
        return;
    }

    calculateSales(activeRow);
}

/* =====================
   INPUT HANDLING
   ===================== */
getRows().forEach(row => {
    row.querySelectorAll("input:not(.readonly)").forEach(input => {
        input.inputMode = "numeric";
        input.addEventListener("input", () => {
            input.value = input.value.replace(/\D/g, "").slice(0, 6);
            update(row);
        });
        input.addEventListener("focus", () => { input.placeholder = ""; });
        input.addEventListener("blur", () => {
            if (input.value === "") input.placeholder = "0";
        });
    });
});

/* =====================
   HAMBURGER MENU
   ===================== */
const menu = document.querySelector('.menu');
const menuBtn = menu.querySelector('.menu-btn');
const menuList = menu.querySelector('.menu-list');
menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('active');
});
document.addEventListener('click', (e) => {
    if (!menu.contains(e.target)) menu.classList.remove('active');
});
menuList.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => { menu.classList.remove('active'); });
});

function about() {
    alert("Contact: brktmbrt@gmail.com");
}
