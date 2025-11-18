# TODO - Pending Features & Improvements

## High Priority

### 1. Add Mapa Emocional ✅ COMPLETE
- [x] Decision: Mapa Emocional as 5th Mapa (separate territory)
- [x] Create migration `003_add_mapa_emocional.sql` to add Mapa Emocional to `mapas` table
- [x] Update types to include 'Emocional' as a valid Mapa nombre
- [x] Update AI analysis prompt to include Mapa Emocional
- [x] Update mobile app types to include Mapa Emocional
- [x] **Run migration in Supabase** ✅ Migration applied successfully!
- [ ] Update web app components to handle 5 mapas (see section 2 below)

### 2. Update Web App Pages (Website + Next.js App)
- [ ] **Next.js App:**
  - [x] Update `app/upload/page.tsx` to work with new Fases/Sub-etapas/Mapas structure
  - [x] Update `app/gallery/page.tsx` to filter by Fase, Sub-etapa, and Mapa
  - [x] Update `components/CategoryFilter.tsx` to use new structure (Fases, Sub-etapas, Mapas)
  - [x] Update `components/ImageCard.tsx` to display Fase, Sub-etapa, and Mapa
  - [x] Update `app/page.tsx` to reflect 5 mapas instead of old categories
- [ ] **Website (Static HTML):**
  - [ ] Update `website/secciones/mapas.html` to include Mapa Emocional
  - [ ] Create `website/mapas/mapa-emocional.html` page
  - [ ] Update `website/trajectory.html` to show 5 mapas
  - [ ] Update navigation/links to include Mapa Emocional
  - [ ] Update any references to "4 mapas" to "5 mapas"

### 3. Database Migration
- [ ] Run migration `002_add_fases_subetapas_auth.sql` in Supabase
- [ ] Verify all reference data (fases, sub_etapas, mapas) is inserted correctly
- [ ] Test RLS policies work correctly
- [ ] Create test user accounts with different roles

## Medium Priority

### 4. Mobile App Enhancements
- [ ] Add image detail screen (full view with all metadata)
- [ ] Add filtering by Fase, Sub-etapa, and Mapa in GalleryScreen
- [ ] Add pull-to-refresh to all screens
- [ ] Improve error handling and user feedback
- [ ] Add loading states for all async operations
- [ ] Add image editing capabilities (edit title, description, tags)

### 5. AI Analysis Improvements
- [ ] Fine-tune AI prompts for better classification accuracy
- [ ] Add validation to ensure sub_etapa matches selected fase
- [ ] Add fallback handling if AI returns invalid classifications
- [ ] Consider adding confidence scores for classifications

### 6. User Experience
- [ ] Add onboarding flow for new users
- [ ] Add help/tutorial screens explaining the philosophy
- [ ] Add ability to view images by phase progression
- [ ] Add statistics/insights (e.g., "You have 8 images in Inconsciencia")
- [ ] Add export functionality (export gallery as PDF/report)

## Low Priority

### 7. Admin Features
- [ ] Create admin dashboard for role management
- [ ] Add ability to bulk update user roles
- [ ] Add analytics dashboard (image uploads, phase distribution, etc.)

### 8. Performance & Optimization
- [ ] Optimize image loading (lazy loading, thumbnails)
- [ ] Add image compression before upload
- [ ] Cache reference data (fases, sub_etapas, mapas)
- [ ] Add offline support for viewing cached images

### 9. Additional Features
- [ ] Add image collections/folders
- [ ] Add sharing functionality
- [ ] Add comments/notes on images
- [ ] Add favorites/bookmarks
- [ ] Add dark mode support

## Technical Debt

### 10. Code Quality
- [ ] Add unit tests for critical functions
- [ ] Add integration tests for API routes
- [ ] Add E2E tests for mobile app flows
- [ ] Improve TypeScript type safety
- [ ] Add error boundaries in React components

### 11. Documentation
- [ ] Update API documentation
- [ ] Create user guide for mobile app
- [ ] Document database schema relationships
- [ ] Create deployment guide

## Notes

### Mapa Emocional Recommendation

**Recommendation: Add as 5th Mapa (separate territory)**

**Reasoning:**
1. **Distinct Territory**: Emotions are fundamentally different from thoughts:
   - Mental = cognitive patterns, beliefs, mental code
   - Emocional = feelings, emotional states, emotional patterns, emotional intelligence

2. **Philosophical Alignment**: The philosophy mentions "reactividad emocional" in Fase 1, suggesting emotions are a core territory worthy of their own map

3. **Somatic Connection**: While emotions have physical components (overlap with Físico), they also have:
   - Cognitive components (overlap with Mental)
   - Relational components (overlap with Familiar)
   - But they deserve their own territory for emotional intelligence work

4. **Practical Value**: Having a dedicated Mapa Emocional allows for:
   - Better classification of emotional content
   - Focused work on emotional patterns
   - Clearer distinction between mental patterns and emotional experiences

5. **Completeness**: With 5 mapas, you cover:
   - Mental (thoughts)
   - Emocional (feelings)
   - Físico (body)
   - Familiar (relationships)
   - Financiero (material)

**If choosing Option B (part of Mental):**
- Would need to update Mapa Mental description to include emotions
- Less granular classification
- May lose nuance between cognitive and emotional patterns

**Suggested Mapa Emocional Definition:**
- **Territorio:** Sentimientos, estados emocionales, inteligencia emocional
- **Propósito:** 
  - Reconocer y nombrar emociones
  - Desarrollar inteligencia emocional
  - Transformar reactividad en respuesta consciente
  - Integrar emociones como información valiosa
- **Color Asociado:** Rojo/Naranja (pasión, vitalidad emocional)
