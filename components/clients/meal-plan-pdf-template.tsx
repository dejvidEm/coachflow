import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Meal, Supplement } from '@/lib/db/schema';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #44B080', // Will be overridden dynamically
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#666666',
  },
  mealSection: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 5,
  },
  supplementSection: {
    marginBottom: 15,
    padding: 8,
    backgroundColor: '#F9F9F9',
    borderRadius: 5,
    width: 150,
    marginRight: 10,
  },
  supplementRow: {
    flexDirection: 'row',
    marginBottom: 15,
    width: '100%',
  },
  supplementGroup: {
    marginBottom: 20,
  },
  supplementGroupTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: '1 solid #44B080',
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  mealName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  supplementName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  mealCategory: {
    fontSize: 10,
    padding: '4 8',
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    color: '#333',
  },
  supplementWhen: {
    fontSize: 8,
    padding: '2 6',
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    color: '#333',
    marginBottom: 5,
  },
  mealInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTop: '1 solid #E0E0E0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  supplementInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  infoLabel: {
    fontSize: 10,
    color: '#666666',
  },
  supplementInfoLabel: {
    fontSize: 8,
    color: '#666666',
  },
  infoValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  supplementInfoValue: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  note: {
    marginTop: 8,
    paddingTop: 8,
    borderTop: '1 solid #E0E0E0',
    fontSize: 10,
    color: '#666666',
    fontStyle: 'italic',
  },
  supplementNote: {
    marginTop: 5,
    paddingTop: 5,
    borderTop: '1 solid #E0E0E0',
    fontSize: 8,
    color: '#666666',
    fontStyle: 'italic',
  },
  supplementBenefits: {
    marginTop: 5,
    paddingTop: 5,
    borderTop: '1 solid #E0E0E0',
    fontSize: 8,
    color: '#333',
    lineHeight: 1.3,
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: '1 solid #E0E0E0',
    fontSize: 10,
    color: '#999999',
    textAlign: 'center',
  },
});

const categoryLabels: Record<string, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
  snack: 'Snack',
};

const whenToTakeLabels: Record<string, string> = {
  morning: 'Morning',
  afternoon: 'Afternoon',
  evening: 'Evening',
  before_meal: 'Before Meal',
  after_meal: 'After Meal',
  with_meal: 'With Meal',
  before_bed: 'Before Bed',
  as_needed: 'As Needed',
};

// Order for grouping supplements
const supplementGroupOrder = [
  'morning',
  'before_meal',
  'with_meal',
  'after_meal',
  'afternoon',
  'evening',
  'before_bed',
  'as_needed',
];

interface MealPlanPdfTemplateProps {
  clientName: string;
  meals: Meal[];
  supplements?: Supplement[];
  logoUrl?: string | null;
  logoPosition?: 'top-left' | 'top-center' | 'top-right' | null;
  accentColor?: string | null;
}

export function MealPlanPdfTemplate({ 
  clientName, 
  meals, 
  supplements = [],
  logoUrl,
  logoPosition = 'top-left',
  accentColor = '#44B080'
}: MealPlanPdfTemplateProps) {
  const hasSupplements = supplements.length > 0;
  const hasMeals = meals.length > 0;
  
  // Use custom accent color or default
  const accentColorValue = accentColor || '#44B080';
  
  // Logo position styles
  const getLogoPositionStyle = (): { alignItems: 'flex-start' | 'center' | 'flex-end' } => {
    switch (logoPosition) {
      case 'top-center':
        return { alignItems: 'center' };
      case 'top-right':
        return { alignItems: 'flex-end' };
      default: // top-left
        return { alignItems: 'flex-start' };
    }
  };

  // Group supplements by whenToTake
  const groupedSupplements: Record<string, Supplement[]> = {};
  supplements.forEach((supplement) => {
    const key = supplement.whenToTake;
    if (!groupedSupplements[key]) {
      groupedSupplements[key] = [];
    }
    groupedSupplements[key].push(supplement);
  });

  // Render supplements grouped by timing
  const renderSupplementsByGroup = () => {
    const groups: any[] = [];
    let supplementIndex = 0;

    supplementGroupOrder.forEach((groupKey) => {
      const groupSupplements = groupedSupplements[groupKey];
      if (!groupSupplements || groupSupplements.length === 0) return;

      const rows: any[] = [];
      for (let i = 0; i < groupSupplements.length; i += 3) {
        const rowSupplements = groupSupplements.slice(i, i + 3);
        const supplementCards = rowSupplements.map((supplement) => {
          const currentIndex = supplementIndex++;
          return (
            <View key={`supplement-${supplement.id}`} style={styles.supplementSection}>
              <Text style={styles.supplementName}>{supplement.name}</Text>
              
              <View style={styles.supplementInfoRow}>
                <Text style={styles.supplementInfoLabel}>Dose:</Text>
                <Text style={styles.supplementInfoValue}>{supplement.pillsPerDose} pill{supplement.pillsPerDose !== 1 ? 's' : ''}</Text>
              </View>
              
              {supplement.dosage && (
                <View style={styles.supplementInfoRow}>
                  <Text style={styles.supplementInfoLabel}>Dosage:</Text>
                  <Text style={styles.supplementInfoValue}>{supplement.dosage}</Text>
                </View>
              )}

              <View style={styles.supplementBenefits}>
                <Text>{supplement.benefits}</Text>
              </View>

              {supplement.note && (
                <View style={styles.supplementNote}>
                  <Text>Note: {supplement.note}</Text>
                </View>
              )}
            </View>
          );
        });

        // Add empty views to fill the row if needed (for consistent layout)
        while (supplementCards.length < 3) {
          supplementCards.push(<View key={`empty-${supplementCards.length}`} style={{ width: 150, marginRight: 10 }} />);
        }

        rows.push(
          <View key={`row-${groupKey}-${i}`} style={styles.supplementRow}>
            {supplementCards}
          </View>
        );
      }

      groups.push(
        <View key={`group-${groupKey}`} style={styles.supplementGroup}>
          <Text style={[styles.supplementGroupTitle, { borderBottomColor: accentColorValue }]}>
            {whenToTakeLabels[groupKey] || groupKey}
          </Text>
          {rows}
        </View>
      );
    });

    return groups;
  };

  return (
    <Document>
      {/* Supplements Page (First Page) */}
      {hasSupplements && (
        <Page size="A4" style={styles.page}>
          {/* Logo */}
          {logoUrl && (
            <View style={[{ marginBottom: 15 }, getLogoPositionStyle()]}>
              <Image src={logoUrl} style={{ width: 80, height: 80, objectFit: 'contain' }} />
            </View>
          )}
          
          <View style={[styles.header, { borderBottomColor: accentColorValue }]}>
            <Text style={styles.title}>Supplements Plan</Text>
            <Text style={styles.subtitle}>Prepared for: {clientName}</Text>
            <Text style={styles.subtitle}>
              Generated on: {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          {renderSupplementsByGroup()}

          <View style={styles.footer}>
            <Text>This supplements plan was generated by CoachFlow</Text>
          </View>
        </Page>
      )}

      {/* Meals Pages */}
      {hasMeals && (
        <Page size="A4" style={styles.page}>
          {/* Logo */}
          {logoUrl && (
            <View style={[{ marginBottom: 15 }, getLogoPositionStyle()]}>
              <Image src={logoUrl} style={{ width: 80, height: 80, objectFit: 'contain' }} />
            </View>
          )}
          
          <View style={[styles.header, { borderBottomColor: accentColorValue }]}>
            <Text style={styles.title}>Meal Plan</Text>
            <Text style={styles.subtitle}>Prepared for: {clientName}</Text>
            <Text style={styles.subtitle}>
              Generated on: {new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          {meals.map((meal, index) => (
            <View key={meal.id} style={styles.mealSection} break={index > 0 && index % 3 === 0}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <View style={styles.mealCategory}>
                  <Text>{categoryLabels[meal.category] || meal.category}</Text>
                </View>
              </View>

              <View style={styles.mealInfo}>
                <View style={{ flex: 1 }}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Calories:</Text>
                    <Text style={styles.infoValue}>{meal.calories} kcal</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Protein:</Text>
                    <Text style={styles.infoValue}>{meal.proteinG}g</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Carbs:</Text>
                    <Text style={styles.infoValue}>{meal.carbsG}g</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Fats:</Text>
                    <Text style={styles.infoValue}>{meal.fatsG}g</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Portion Size:</Text>
                    <Text style={styles.infoValue}>{meal.portionSize}</Text>
                  </View>
                </View>
              </View>

              {meal.note && (
                <View style={styles.note}>
                  <Text>Note: {meal.note}</Text>
                </View>
              )}
            </View>
          ))}

          <View style={styles.footer}>
            <Text>This meal plan was generated by CoachFlow</Text>
          </View>
        </Page>
      )}
    </Document>
  );
}

