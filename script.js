// База данных элементов таблицы Менделеева (4 полных периода)
const elementRegistry = {
    "H":  { valency: 1,    mass: 1,    z: 1  },
    "He": { valency: null, mass: 4,    z: 2  },
    "Li": { valency: 1,    mass: 7,    z: 3  },
    "Be": { valency: 2,    mass: 9,    z: 4  },
    "B":  { valency: 3,    mass: 11,   z: 5  },
    "C":  { valency: null, mass: 12,   z: 6  },
    "N":  { valency: null, mass: 14,   z: 7  },
    "O":  { valency: 2,    mass: 16,   z: 8  },
    "F":  { valency: 1,    mass: 19,   z: 9  },
    "Ne": { valency: null, mass: 20,   z: 10 },
    "Na": { valency: 1,    mass: 23,   z: 11 },
    "Mg": { valency: 2,    mass: 24,   z: 12 },
    "Al": { valency: 3,    mass: 27,   z: 13 },
    "Si": { valency: null, mass: 28,   z: 14 },
    "P":  { valency: null, mass: 31,   z: 15 },
    "S":  { valency: null, mass: 32,   z: 16 },
    "Cl": { valency: 1,    mass: 35.5, z: 17 },
    "Ar": { valency: null, mass: 40,   z: 18 },
    "K":  { valency: 1,    mass: 39,   z: 19 },
    "Ca": { valency: 2,    mass: 40,   z: 20 },
    "Sc": { valency: 3,    mass: 45,   z: 21 },
    "Ti": { valency: null, mass: 48,   z: 22 },
    "V":  { valency: null, mass: 51,   z: 23 },
    "Cr": { valency: null, mass: 52,   z: 24 },
    "Mn": { valency: null, mass: 55,   z: 25 },
    "Fe": { valency: null, mass: 56,   z: 26 },
    "Co": { valency: null, mass: 59,   z: 27 },
    "Ni": { valency: null, mass: 59,   z: 28 },
    "Cu": { valency: null, mass: 64,   z: 29 },
    "Zn": { valency: 2,    mass: 65,   z: 30 },
    "Ga": { valency: null, mass: 70,   z: 31 },
    "Ge": { valency: null, mass: 73,   z: 32 },
    "As": { valency: null, mass: 75,   z: 33 },
    "Se": { valency: null, mass: 79,   z: 34 },
    "Br": { valency: 1,    mass: 80,   z: 35 },
    "Kr": { valency: null, mass: 84,   z: 36 },
    "Ag": { valency: 1,    mass: 108,  z: 47 },
    "I":  { valency: 1,    mass: 127,  z: 53 },
    "Ba": { valency: 2,    mass: 137,  z: 56 }
};

// База сложных кислотных остатков и многоатомных групп
const complexGroups = {
    "SO4":  { valency: 2, mass: 96 },
    "CO3":  { valency: 2, mass: 60 },
    "SO3":  { valency: 2, mass: 80 },
    "SiO3": { valency: 2, mass: 76 },
    "NO3":  { valency: 1, mass: 62 },
    "NO2":  { valency: 1, mass: 46 },
    "PO4":  { valency: 3, mass: 95 },
    "OH":   { valency: 1, mass: 17 }
};

// Функция распределения электронов
function getElectronLayers(atomicNumber) {
    if (!atomicNumber) return "Нет данных";
    let electrons = atomicNumber;
    let layers = [];
    
    let layer1 = Math.min(electrons, 2);
    layers.push(layer1);
    electrons -= layer1;
    if (electrons <= 0) return layers.join(", ");

    let layer2 = Math.min(electrons, 8);
    layers.push(layer2);
    electrons -= layer2;
    if (electrons <= 0) return layers.join(", ");

    if (atomicNumber >= 21 && atomicNumber <= 30) {
        let layer4 = (atomicNumber === 24 || atomicNumber === 29) ? 1 : 2;
        let layer3 = electrons - layer4;
        layers.push(layer3);
        layers.push(layer4);
        return layers.join(", ");
    }

    let layer3 = Math.min(electrons, 8);
    layers.push(layer3);
    electrons -= layer3;
    if (electrons <= 0) return layers.join(", ");

    let layer4 = Math.min(electrons, 8);
    layers.push(layer4);
    
    return layers.join(", ");
}

// Римские цифры для валентности
function toRoman(num) {
    if (num % 1 !== 0) return num.toFixed(1);
    const romanMatrix = [
        ["M", 1000], ["CM", 900], ["D", 500], ["CD", 400], ["C", 100], 
        ["XC", 90], ["L", 50], ["XL", 40], ["X", 10], ["IX", 9], 
        ["V", 5], ["IV", 4], ["I", 1]
    ];
    let str = "";
    for (const [letter, value] of romanMatrix) {
        while (num >= value) { str += letter; num -= value; }
    }
    return str || "I";
}
// --- БЛОК 1: АНАЛИЗ ОДНОГО ВЕЩЕСТВА ---
document.getElementById("calc-btn").addEventListener("click", function() {
    const formula = document.getElementById("formula").value.trim();
    const resultDiv = document.getElementById("result");

    if (!formula) {
        alert("Пожалуйста, введите формулу!");
        return;
    }

    let elem1 = "", index1 = 1;
    let elem2 = "", index2 = 1;
    let isRecognized = false;
    let isSaltWithBrackets = false;

    // Регулярные выражения без конфликтующих символов конца строки
    const bracketMatch = formula.match(/^([A-Z][a-z]?)([0-9]*)\(([A-Z][A-Za-z0-9]*)\)([0-9]*)/);
    if (bracketMatch && bracketMatch.at(0) === formula) {
        elem1 = bracketMatch.at(1); 
        index1 = bracketMatch.at(2) ? parseInt(bracketMatch.at(2)) : 1;
        elem2 = bracketMatch.at(3); 
        index2 = bracketMatch.at(4) ? parseInt(bracketMatch.at(4)) : 1;
        isRecognized = true;
        isSaltWithBrackets = true;
    } else {
        for (let key in complexGroups) {
            if (formula.endsWith(key) && formula !== key) {
                elem2 = key; 
                index2 = 1;
                const rest = formula.slice(0, -key.length);
                const headMatch = rest.match(/^([A-Z][a-z]?)([0-9]*)/);
                if (headMatch && headMatch.at(0) === rest) { 
                    elem1 = headMatch.at(1); 
                    index1 = headMatch.at(2) ? parseInt(headMatch.at(2)) : 1; 
                    isRecognized = true; 
                    break; 
                }
            }
        }
        
        if (!isRecognized) {
            const binaryMatch = formula.match(/^([A-Z][a-z]?)([0-9]*)([A-Z][a-z]?)([0-9]*)/);
            if (binaryMatch && binaryMatch.at(0) === formula) {
                elem1 = binaryMatch.at(1); 
                index1 = binaryMatch.at(2) ? parseInt(binaryMatch.at(2)) : 1;
                elem2 = binaryMatch.at(3); 
                index2 = binaryMatch.at(4) ? parseInt(binaryMatch.at(4)) : 1;
                isRecognized = true;
            }
        }
    }

    if (!isRecognized || !elem1 || !elem2) {
        resultDiv.innerHTML = "<strong>Ошибка:</strong> Не удалось распознать. Вводите строго по химическому регистру (например: <em>HCl</em>, <em>H2SO4</em>, <em>Ca(NO3)2</em>).";
        resultDiv.classList.remove("hidden");
        return;
    }

    let valency1 = null, valency2 = null;
    const info1 = elementRegistry[elem1];
    const info2 = complexGroups[elem2] || elementRegistry[elem2];

    if (info2 && info2.valency !== null) {
        valency2 = info2.valency;
        valency1 = (valency2 * index2) / index1;
    } else if (info1 && info1.valency !== null) {
        valency1 = info1.valency;
        valency2 = (valency1 * index1) / index2;
    }

    const mass1 = info1 ? info1.mass : 0;
    const mass2 = complexGroups[elem2] ? complexGroups[elem2].mass : (elementRegistry[elem2] ? elementRegistry[elem2].mass : 0);
    const totalMolecularMass = (mass1 * index1) + (mass2 * index2);

    const formattedFormula = formula.replace(/([0-9]+)/g, "<sub>\$1</sub>");
    let htmlOutput = `<h4 style="margin:0 0 12px 0; color:#2c3e50; font-size:18px;">Анализ вещества ${formattedFormula}:</h4>`;

    if (mass1 && mass2) {
        htmlOutput += `
            <div style="background:#ebf5fb; padding:10px; border-radius:6px; margin-bottom:12px; border-left:4px solid #2980b9; font-size:14px;">
                ⚖️ <strong>Молярная масса:</strong> <span style="color:#2980b9; font-weight:bold;">${totalMolecularMass} г/моль</span><br>
                <small style="color:#7f8c8d;">Расчет: (${mass1} × ${index1}) + (${mass2} × ${index2})</small>
            </div>`;
    }

    if (valency1 !== null && valency2 !== null) {
        htmlOutput += `
            <div style="background:#e8f8f5; padding:10px; border-radius:6px; margin-bottom:12px; border-left:4px solid #1abc9c; font-size:14px;">
                📍 <strong>Валентность элементов:</strong> <br>
                • Элемент <strong>${elem1}</strong> = <strong>${toRoman(valency1)}</strong> | • Группа/Элемент <strong>${elem2}</strong> = <strong>${toRoman(valency2)}</strong>
            </div>`;
    }

    htmlOutput += `<div style="background:#fcf8e3; padding:12px; border-radius:6px; border-left:4px solid #f39c12; font-size:13px;">
        ⚛️ <strong>Строение электронных оболочек:</strong><br><br>`;
        
    if (info1) {
        htmlOutput += `• Атом <strong>${elem1}</strong> (Z=${info1.z}): <span style="font-size:14px; color:#2c3e50; font-weight:bold;">${getElectronLayers(info1.z)}</span> (по уровням)<br>`;
    }
    
    if (isSaltWithBrackets) {
        htmlOutput += `• Группа <strong>${elem2}</strong> является сложным многоатомным ионом со своей структурой связей.`;
    } else if (elementRegistry[elem2]) {
        htmlOutput += `• Атом <strong>${elem2}</strong> (Z=${elementRegistry[elem2].z}): <span style="font-size:14px; color:#2c3e50; font-weight:bold;">${getElectronLayers(elementRegistry[elem2].z)}</span>`;
    }
    htmlOutput += "</div>";

    resultDiv.innerHTML = htmlOutput;
    resultDiv.classList.remove("hidden");
});

// --- БЛОК 2: УРАВНИВАНИЕ РЕАКЦИЙ ---
function parseSubstance(substance) {
    const atoms = {};
    const regex = /([A-Z][a-z]?)([0-9]*)/g;
    let match;
    while ((match = regex.exec(substance)) !== null) {
        const element = match.at(1);
        const count = match.at(2) ? parseInt(match.at(2)) : 1;
        if (element) {
            atoms[element] = (atoms[element] || 0) + count;
        }
    }
    return atoms;
}

function balanceChemicalEquation(leftStr, rightStr) {
    const leftSubstances = leftStr.split("+").map(s => s.trim());
    const rightSubstances = rightStr.split("+").map(s => s.trim());
    
    const leftParsed = leftSubstances.map(parseSubstance);
    const rightParsed = rightSubstances.map(parseSubstance);
    
    const allElements = new Set();
    leftParsed.forEach(obj => Object.keys(obj).forEach(el => allElements.add(el)));

    const numL = leftSubstances.length;
    const numR = rightSubstances.length;
    
    if (numL + numR <= 4) {
        for (let c1 = 1; c1 <= 12; c1++) {
            for (let c2 = 1; c2 <= 12; c2++) {
                for (let c3 = 1; c3 <= 12; c3++) {
                    for (let c4 = 1; c4 <= 12; c4++) {
                        const coeffs = [c1, c2, c3, c4];
                        let isBalanced = true;

                        for (let el of allElements) {
                            let leftCount = 0;
                            let rightCount = 0;

                            if (numL >= 1) leftCount += (leftParsed.at(0)?.[el] || 0) * coeffs.at(0);
                            if (numL >= 2) leftCount += (leftParsed.at(1)?.[el] || 0) * coeffs.at(1);

                            if (numR >= 1) rightCount += (rightParsed.at(0)?.[el] || 0) * coeffs.at(numL);
                            if (numR >= 2) rightCount += (rightParsed.at(1)?.[el] || 0) * coeffs.at(numL + 1);

                            if (leftCount !== rightCount) {
                                isBalanced = false;
                                break;
                            }
                        }

                        if (isBalanced) {
                            let finalLeft = leftSubstances.map((s, idx) => (coeffs.at(idx) > 1 ? coeffs.at(idx) : "") + s).join(" + ");
                            let finalRight = rightSubstances.map((s, idx) => (coeffs.at(numL + idx) > 1 ? coeffs.at(numL + idx) : "") + s).join(" + ");
                            return finalLeft + " = " + finalRight;
                        }
                    }
                }
            }
        }
    }
    return null; 
}

document.getElementById("equal-btn").addEventListener("click", function() {
    const eqInput = document.getElementById("equation").value.trim();
    const eqResultDiv = document.getElementById("eq-result");

    if (!eqInput.includes("=")) {
        alert('Пожалуйста, введите уравнение, разделив части знаком "="');
        return;
    }

    const parts = eqInput.split("=");
    const balanced = balanceChemicalEquation(parts.at(0), parts.at(1));

    if (balanced) {
        let formatted = balanced.replace(/([A-Za-z]+)([0-9]+)/g, "\$1<sub>\$2</sub>");
        eqResultDiv.innerHTML = `
            <div style="background:#e8f8f5; padding:15px; border-radius:6px; border-left:4px solid #1abc9c; font-size:15px;">
                ✅ <strong>Сбалансированное уравнение реакции:</strong><br>
                <div style="margin-top:10px; font-size:18px; font-weight:bold; color:#16a085; letter-spacing: 0.5px;">${formatted}</div>
            </div>`;
    } else {
        eqResultDiv.innerHTML = `
            <div style="background:#f2dede; padding:15px; border-radius:6px; border-left:4px solid #a94442; color:#a94442; font-size:14px;">
                ❌ <strong>Не удалось уравнять.</strong> Проверьте, что реакция относится к школьным типам соединений или обмена (до 2 реагентов и 2 продуктов).
            </div>`;
    }
    eqResultDiv.classList.remove("hidden");
});
