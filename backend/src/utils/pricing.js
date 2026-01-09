/**
 * Utilitaire de calcul de tarification
 * Basé sur le quotient familial / coefficient social
 */

/**
 * Tranches tarifaires basées sur le coefficient social
 * Plus le coefficient est élevé, plus le prix est élevé
 */
const PRICING_TIERS = [
  { maxCoefficient: 0.5, pricePerMeal: 0.50 },  // Très faibles revenus
  { maxCoefficient: 1.0, pricePerMeal: 1.50 },  // Faibles revenus
  { maxCoefficient: 1.5, pricePerMeal: 2.50 },  // Revenus modestes
  { maxCoefficient: 2.0, pricePerMeal: 3.50 },  // Revenus moyens
  { maxCoefficient: 2.5, pricePerMeal: 4.50 },  // Revenus confortables
  { maxCoefficient: Infinity, pricePerMeal: 5.50 } // Hauts revenus
];

/**
 * Prix par défaut si pas de coefficient fourni
 */
const DEFAULT_PRICE_PER_MEAL = 4.00;

/**
 * Nombre moyen de repas par mois (environ 4 semaines)
 */
const WEEKS_PER_MONTH = 4;

/**
 * Calcule le coefficient social à partir du salaire
 * Formule simplifiée: salaire / 1500 (SMIC approximatif)
 * @param {number} salary - Salaire mensuel
 * @returns {number} Coefficient social
 */
const calculateCoefficientFromSalary = (salary) => {
  if (!salary || salary <= 0) return 1.0;
  const smic = 1500; // SMIC net approximatif
  return Math.round((salary / smic) * 100) / 100;
};

/**
 * Calcule le prix par repas basé sur le coefficient social
 * @param {number} coefficient - Coefficient social
 * @returns {number} Prix par repas
 */
const calculatePricePerMeal = (coefficient) => {
  if (coefficient === null || coefficient === undefined) {
    return DEFAULT_PRICE_PER_MEAL;
  }
  
  const tier = PRICING_TIERS.find(t => coefficient <= t.maxCoefficient);
  return tier ? tier.pricePerMeal : DEFAULT_PRICE_PER_MEAL;
};

/**
 * Calcule le nombre de repas par mois pour un enfant
 * @param {Array<string>} canteenDays - Jours de présence (ex: ['LUNDI', 'MARDI'])
 * @returns {number} Nombre de repas par mois
 */
const calculateMealsPerMonth = (canteenDays) => {
  if (!canteenDays || !Array.isArray(canteenDays)) return 0;
  return canteenDays.length * WEEKS_PER_MONTH;
};

/**
 * Calcule le prix mensuel estimé pour un enfant
 * @param {number} pricePerMeal - Prix unitaire du repas
 * @param {Array<string>} canteenDays - Jours de présence
 * @returns {number} Prix mensuel estimé
 */
const calculateMonthlyPrice = (pricePerMeal, canteenDays) => {
  const mealsPerMonth = calculateMealsPerMonth(canteenDays);
  return Math.round(pricePerMeal * mealsPerMonth * 100) / 100;
};

/**
 * Calcule la tarification complète pour une famille
 * @param {Object} params - Paramètres de calcul
 * @param {Array} params.parents - Liste des parents avec salaire ou coefficient
 * @param {Array} params.children - Liste des enfants avec jours de cantine
 * @returns {Object} Résultat de tarification
 */
const calculateFamilyPricing = ({ parents, children }) => {
  // Détermine le coefficient social
  let socialCoefficient = null;
  
  // Priorité au coefficient social explicite
  for (const parent of parents) {
    if (parent.social_coefficient !== null && parent.social_coefficient !== undefined) {
      socialCoefficient = parent.social_coefficient;
      break;
    }
  }
  
  // Sinon, calcul à partir du salaire le plus élevé
  if (socialCoefficient === null) {
    const maxSalary = Math.max(
      ...parents
        .filter(p => p.salary_monthly !== null && p.salary_monthly !== undefined)
        .map(p => p.salary_monthly),
      0
    );
    
    if (maxSalary > 0) {
      socialCoefficient = calculateCoefficientFromSalary(maxSalary);
    }
  }
  
  // Si toujours pas de coefficient, utilise le coefficient par défaut (1.5)
  const coefficientUsed = socialCoefficient !== null ? socialCoefficient : 1.5;
  
  // Calcul du prix par repas
  const pricePerMeal = calculatePricePerMeal(coefficientUsed);
  
  // Calcul du prix mensuel total pour tous les enfants
  let totalMonthlyPrice = 0;
  const childrenPricing = children.map(child => {
    const canteenDays = child.canteen_days || [];
    const monthlyPrice = calculateMonthlyPrice(pricePerMeal, canteenDays);
    totalMonthlyPrice += monthlyPrice;
    
    return {
      child_id: child.id,
      first_name: child.info?.first_name || child.first_name,
      canteen_days: canteenDays,
      meals_per_month: calculateMealsPerMonth(canteenDays),
      monthly_price: monthlyPrice
    };
  });
  
  return {
    social_coefficient_used: coefficientUsed,
    price_per_meal: pricePerMeal,
    children_pricing: childrenPricing,
    estimated_monthly_price: Math.round(totalMonthlyPrice * 100) / 100,
    calculated_at: new Date().toISOString()
  };
};

/**
 * Retourne les tranches tarifaires pour affichage
 * @returns {Array} Tranches tarifaires
 */
const getPricingTiers = () => {
  return PRICING_TIERS.map((tier, index) => {
    const minCoefficient = index === 0 ? 0 : PRICING_TIERS[index - 1].maxCoefficient;
    return {
      min_coefficient: minCoefficient,
      max_coefficient: tier.maxCoefficient === Infinity ? null : tier.maxCoefficient,
      price_per_meal: tier.pricePerMeal
    };
  });
};

module.exports = {
  calculateCoefficientFromSalary,
  calculatePricePerMeal,
  calculateMealsPerMonth,
  calculateMonthlyPrice,
  calculateFamilyPricing,
  getPricingTiers,
  PRICING_TIERS,
  DEFAULT_PRICE_PER_MEAL
};
