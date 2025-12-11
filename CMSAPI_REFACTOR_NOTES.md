# cmsApi.ts - Refactoring Opportunities

## Current File: src/services/cmsApi.ts

This file contains several areas that can benefit from the new refactoring system.

---

## 🟡 Issues Found in cmsApi.ts

### 1. Hardcoded Magic Numbers (Line 6)
```typescript
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
```

**Should use:**
```typescript
import { Intervals } from '@/constants/theme';
const CACHE_DURATION = Intervals.cacheExpiry;
```

---

### 2. Image Imports (Lines 24, 29, 34, 39, 44, 49...)
Currently using `require()` with `any` type implied.

**Already fixed in types:**
```typescript
// src/types/presenter.ts now has:
image: ImageSourcePropType | string;
```

**No changes needed** - This is correct! The type system now properly handles these.

---

### 3. Presenter Data Duplication
The MOCK_DATA contains hardcoded presenter information that could be:
- Moved to a separate constants file
- Or kept here if it's truly mock/fallback data

**Consider creating:**
```typescript
// src/constants/presenters.ts
export const PRESENTERS = {
  'Thamsanqa Tshuma': { ... },
  'Dereck Viriri': { ... },
  // etc
};
```

---

### 4. Week Calculation Logic (Lines 10-16)
```typescript
const getBibleKidsPerspectivePresenter = (): string => {
  const now = new Date();
  const weekNumber = Math.floor((now.getDate() - 1) / 7) + 1;
  const isKidsPerspective = weekNumber === 2; // 2nd week of the month

  return isKidsPerspective ? 'Zanele Zama' : (weekNumber % 2 === 1 ? 'Zanele Zama' : 'Dereck Viriri');
};
```

**Could be improved:**
- Extract to utils/date.ts
- Simplify the logic
- Add comments explaining the business rules

**Suggested refactor:**
```typescript
// src/utils/date.ts
export const getWeekOfMonth = (date: Date = new Date()): number => {
  return Math.floor((date.getDate() - 1) / 7) + 1;
};

export const isKidsPerspectiveWeek = (date: Date = new Date()): boolean => {
  return getWeekOfMonth(date) === 2;
};

// src/constants/presenters.ts
export const BIBLE_KIDS_PRESENTERS = {
  KIDS_WEEK: 'Zanele Zama',
  BIBLE_WEEK: 'Dereck Viriri',
} as const;

// Then in cmsApi.ts
import { isKidsPerspectiveWeek } from '@/utils/date';
import { BIBLE_KIDS_PRESENTERS } from '@/constants/presenters';

const getBibleKidsPerspectivePresenter = (): string => {
  return isKidsPerspectiveWeek()
    ? BIBLE_KIDS_PRESENTERS.KIDS_WEEK
    : BIBLE_KIDS_PRESENTERS.BIBLE_WEEK;
};
```

---

## ✅ What's Already Good

1. **Cache implementation** - Good use of AsyncStorage
2. **Type imports** - Using proper TypeScript imports from `@/src/types/presenter`
3. **Constants at top** - CACHE_DURATION and CACHE_KEY properly defined
4. **Error handling** - Try-catch blocks in place
5. **Image types** - Now properly typed as `ImageSourcePropType | string`

---

## 📊 Priority Assessment

| Issue | Priority | Effort | Impact |
|-------|----------|--------|--------|
| Use Intervals.cacheExpiry | 🟡 Medium | 1 min | Low |
| Extract date utilities | 🟡 Medium | 10 min | Medium |
| Move presenters to constants | 🟢 Low | 15 min | Medium |
| Simplify week logic | 🟡 Medium | 5 min | Medium |

**Recommendation**: These are nice-to-have improvements but **not critical**. The current code works fine.

---

## 🚀 If You Want to Refactor This File

### Quick Wins (5 minutes):

1. **Use theme constant:**
```typescript
// Change line 6
import { Intervals } from '@/constants/theme';
const CACHE_DURATION = Intervals.cacheExpiry;
```

2. **Simplify week logic:**
```typescript
// Simplify lines 10-16
const getBibleKidsPerspectivePresenter = (): string => {
  const weekNumber = Math.floor((new Date().getDate() - 1) / 7) + 1;
  return weekNumber === 2 ? 'Zanele Zama' : 'Dereck Viriri';
};
```

### Full Refactor (30 minutes):

1. Create `src/constants/presenters.ts` with all presenter data
2. Create `src/utils/date.ts` with date helper functions
3. Update `cmsApi.ts` to import from these files
4. Add unit tests for date utilities

---

## 🎯 Bottom Line

**Current state**: ✅ Works perfectly, type-safe after our fix
**Refactoring value**: 🟡 Medium - Nice to have but not urgent
**Risk**: 🟢 Low - File is already well-structured

**Recommendation**:
- If you have time: Extract date utilities and use theme constants
- If you don't: Leave as-is, it's perfectly functional

The critical refactoring (type safety) was already done when we fixed `presenter.ts`!

---

*Analysis Date: December 4, 2025*
*File: src/services/cmsApi.ts*
