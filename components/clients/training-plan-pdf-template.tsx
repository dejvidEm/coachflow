import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { Exercise } from '@/lib/db/schema';

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
    borderBottom: '2 solid #44B080',
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
  exerciseSection: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#F9F9F9',
    borderRadius: 5,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  exerciseMuscleGroup: {
    fontSize: 10,
    padding: '4 8',
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    color: '#333',
  },
  exerciseInfo: {
    marginTop: 8,
    paddingTop: 8,
    borderTop: '1 solid #E0E0E0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 10,
    color: '#666666',
  },
  infoValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  description: {
    marginTop: 8,
    paddingTop: 8,
    borderTop: '1 solid #E0E0E0',
    fontSize: 10,
    color: '#666666',
    fontStyle: 'italic',
  },
  footer: {
    marginTop: 30,
    paddingTop: 15,
    borderTop: '1 solid #E0E0E0',
    fontSize: 10,
    color: '#999999',
    textAlign: 'center',
  },
  centeredPage: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '100%',
  },
  centeredContent: {
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    textAlign: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  centeredLogo: {
    marginBottom: 30,
    alignItems: 'center',
  },
  centeredHeader: {
    marginBottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  centeredTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1a1a1a',
    textAlign: 'center',
  },
  centeredText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 1.6,
    marginBottom: 15,
    textAlign: 'center',
  },
  centeredSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  centeredFooter: {
    paddingTop: 20,
    borderTop: '1 solid #E0E0E0',
    fontSize: 12,
    color: '#999999',
    textAlign: 'center',
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
  },
});

const muscleGroupLabels: Record<string, string> = {
  back: 'Back',
  chest: 'Chest',
  arms: 'Arms',
};

interface TrainingPlanPdfTemplateProps {
  clientName: string;
  exercises: Exercise[];
  logoUrl?: string | null;
  logoPosition?: 'top-left' | 'top-center' | 'top-right' | null;
  accentColor?: string | null;
  userName?: string | null;
  firstPageHeading?: string | null;
  firstPageText?: string | null;
  firstPageFooter?: string | null;
  firstPageShowLogo?: boolean | null;
  lastPageHeading?: string | null;
  lastPageText?: string | null;
  lastPageFooter?: string | null;
  lastPageShowLogo?: boolean | null;
}

export function TrainingPlanPdfTemplate({ 
  clientName, 
  exercises,
  logoUrl,
  logoPosition = 'top-left',
  accentColor = '#44B080',
  userName,
  firstPageHeading,
  firstPageText,
  firstPageFooter,
  firstPageShowLogo,
  lastPageHeading,
  lastPageText,
  lastPageFooter,
  lastPageShowLogo,
}: TrainingPlanPdfTemplateProps) {
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

  // Check if custom first page should be shown
  const hasCustomFirstPage = firstPageHeading || firstPageText || firstPageFooter;
  const hasCustomLastPage = lastPageHeading || lastPageText || lastPageFooter;

  return (
    <Document>
      {/* Custom First Page */}
      {hasCustomFirstPage && (
        <Page size="A4" style={styles.centeredPage}>
          <View style={styles.centeredContent}>
            {/* Logo */}
            {logoUrl && firstPageShowLogo && (
              <View style={styles.centeredLogo}>
                <Image src={logoUrl} style={{ width: 100, height: 100, objectFit: 'contain' }} />
              </View>
            )}
            
            {/* Heading */}
            {firstPageHeading && (
              <View style={styles.centeredHeader}>
                <Text style={[styles.centeredTitle, { borderBottomColor: accentColorValue, borderBottomWidth: 2, paddingBottom: 15, width: '100%' }]}>
                  {firstPageHeading}
                </Text>
                {/* User Name under heading */}
                {userName && (
                  <Text style={styles.centeredSubtitle}>
                    {userName}
                  </Text>
                )}
              </View>
            )}
            
            {/* Text Content */}
            {firstPageText && (
              <View style={{ marginBottom: 20, width: '100%' }}>
                <Text style={styles.centeredText}>{firstPageText}</Text>
              </View>
            )}
          </View>

          {/* Footer - positioned at bottom */}
          {firstPageFooter && (
            <View style={styles.centeredFooter}>
              <Text>{firstPageFooter}</Text>
            </View>
          )}
        </Page>
      )}

      {/* Training Plan Content Page */}
      <Page size="A4" style={styles.page}>
        {/* Logo */}
        {logoUrl && (
          <View style={[{ marginBottom: 15 }, getLogoPositionStyle()]}>
            <Image src={logoUrl} style={{ width: 80, height: 80, objectFit: 'contain' }} />
          </View>
        )}
        
        <View style={[styles.header, { borderBottomColor: accentColorValue }]}>
          <Text style={styles.title}>Training Plan</Text>
          <Text style={styles.subtitle}>Prepared for: {clientName}</Text>
          <Text style={styles.subtitle}>
            Generated on: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {exercises.map((exercise, index) => (
          <View key={exercise.id} style={styles.exerciseSection} break={index > 0 && index % 3 === 0}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <View style={styles.exerciseMuscleGroup}>
                <Text>{muscleGroupLabels[exercise.muscleGroup] || exercise.muscleGroup}</Text>
              </View>
            </View>

            <View style={styles.exerciseInfo}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Sets:</Text>
                <Text style={styles.infoValue}>{exercise.sets}</Text>
              </View>
            </View>

            {exercise.description && (
              <View style={styles.description}>
                <Text>Description: {exercise.description}</Text>
              </View>
            )}
          </View>
        ))}

        {!hasCustomLastPage && (
          <View style={styles.footer}>
            <Text>This training plan was generated by CoachFlow</Text>
          </View>
        )}
      </Page>

      {/* Custom Last Page */}
      {hasCustomLastPage && (
        <Page size="A4" style={styles.centeredPage}>
          <View style={styles.centeredContent}>
            {/* Logo */}
            {logoUrl && lastPageShowLogo && (
              <View style={styles.centeredLogo}>
                <Image src={logoUrl} style={{ width: 100, height: 100, objectFit: 'contain' }} />
              </View>
            )}
            
            {/* Heading */}
            {lastPageHeading && (
              <View style={styles.centeredHeader}>
                <Text style={[styles.centeredTitle, { borderBottomColor: accentColorValue, borderBottomWidth: 2, paddingBottom: 15, width: '100%' }]}>
                  {lastPageHeading}
                </Text>
              </View>
            )}
            
            {/* Text Content */}
            {lastPageText && (
              <View style={{ marginBottom: 20, width: '100%' }}>
                <Text style={styles.centeredText}>{lastPageText}</Text>
              </View>
            )}
          </View>

          {/* Footer - positioned at bottom */}
          {lastPageFooter && (
            <View style={styles.centeredFooter}>
              <Text>{lastPageFooter}</Text>
            </View>
          )}
        </Page>
      )}
    </Document>
  );
}



