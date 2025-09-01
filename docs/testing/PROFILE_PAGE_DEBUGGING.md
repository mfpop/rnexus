# 🔍 Profile Page Debugging Guide

## 🚨 **Issue Description**

**Problem**: Profile completion shows 100% but the right card (ProfileRightCard) is empty on the profile page.

**Symptoms**:
- ✅ Profile completion percentage: 100%
- ❌ Profile fields are empty/not populated
- ❌ No user data displayed in the right card

## 🔍 **Root Cause Analysis**

### **Data Source Mismatch**

The issue is caused by **two different data sources** being used:

1. **ProfileLeftCard** (Shows 100% completion)
   - **Data Source**: REST API endpoint `/user/profile/`
   - **Status**: Working correctly, shows completion data

2. **ProfileRightCard** (Shows empty fields)
   - **Data Source**: GraphQL query `GET_USER_PROFILE`
   - **Status**: Not returning expected data

### **Why This Happens**

- **ProfileLeftCard** fetches from REST API and calculates completion using `computeProfileCompletion()`
- **ProfileRightCard** fetches from GraphQL but the query might be failing or returning empty data
- **Different data structures** between REST API and GraphQL responses
- **No error handling** in the GraphQL query to show what's going wrong

## 🛠️ **Debugging Steps**

### **Step 1: Check Browser Console**

Open the browser console on the profile page and look for:

```javascript
🔍 ProfileRightCard - GraphQL Data: [data or null]
🔍 ProfileRightCard - Loading: [true/false]
🔍 ProfileRightCard - Error: [error or null]
🔍 initializeProfileData called with: [data]
🔍 Profile data found: [profile object]
```

### **Step 2: Test GraphQL Query Directly**

Go to `http://localhost:8000/graphql/` and test this query:

```graphql
query {
  user_profile {
    id
    user {
      id
      email
      first_name
      last_name
      is_active
    }
    middle_name
    position
    department
    phone
    city
    zip_code
    bio
  }
}
```

**Expected Result**: Should return user profile data
**Actual Result**: Check what's returned

### **Step 3: Check Database Content**

Run the test script to verify data exists:

```bash
cd backend
source .venv/bin/activate
python test_graphql_profile.py
```

**Expected Result**: Should show users and profiles exist
**Actual Result**: Check if profiles are missing

### **Step 4: Create Sample Data (If Missing)**

If no profiles exist, run:

```bash
cd backend
source .venv/bin/activate
python create_sample_user_profiles.py
```

## 🔧 **Potential Issues & Solutions**

### **Issue 1: No UserProfiles in Database**

**Symptoms**: GraphQL query returns `null`
**Solution**: Run `create_sample_user_profiles.py`

### **Issue 2: GraphQL Schema Mismatch**

**Symptoms**: GraphQL errors about field names
**Solution**: Verify field names match between frontend and backend

### **Issue 3: Authentication Context Missing**

**Symptoms**: GraphQL resolver can't access user context
**Solution**: Check if user is properly authenticated

### **Issue 4: Field Name Mismatch**

**Symptoms**: Some fields work, others don't
**Solution**: Check for camelCase vs snake_case mismatches

## 📊 **Data Flow Analysis**

### **Current Flow (Broken)**

```
1. ProfileLeftCard → REST API → Shows 100% completion ✅
2. ProfileRightCard → GraphQL → Shows empty fields ❌
3. No data synchronization between the two
```

### **Expected Flow (Fixed)**

```
1. ProfileLeftCard → GraphQL → Shows completion based on GraphQL data ✅
2. ProfileRightCard → GraphQL → Shows same data ✅
3. Both components use same data source
```

## 🎯 **Immediate Fixes Applied**

### **1. Added Debug Logging**

Added console logging to ProfileRightCard to see:
- What GraphQL data is received
- When profile data is initialized
- Any errors in the process

### **2. Enhanced Error Handling**

- Added loading and error states to GraphQL query
- Better error reporting in console
- Graceful fallback to default values

### **3. Created Test Scripts**

- `test_graphql_profile.py`: Tests GraphQL resolver
- `create_sample_user_profiles.py`: Creates sample data

## 🚀 **Next Steps**

### **Immediate Actions**

1. **Check browser console** for debugging output
2. **Test GraphQL query** directly in GraphQL playground
3. **Run test script** to verify database content
4. **Create sample data** if profiles are missing

### **Long-term Fixes**

1. **Unify Data Sources**: Use GraphQL for both components
2. **Add Error Boundaries**: Better error handling in React components
3. **Implement Caching**: Apollo Client caching for better performance
4. **Add Loading States**: Show loading indicators while data loads

## 🔍 **Debugging Checklist**

- [ ] **Browser Console**: Check for GraphQL errors
- [ ] **GraphQL Playground**: Test query directly
- [ ] **Database Content**: Verify profiles exist
- [ ] **Sample Data**: Create profiles if missing
- [ ] **Field Names**: Check for naming mismatches
- [ ] **Authentication**: Verify user context

## 📝 **Common Error Messages**

### **GraphQL Errors**

```javascript
// Field not found
"Field 'userProfile' doesn't exist on type 'Query'"

// Authentication required
"Authentication required"

// No data returned
"user_profile": null
```

### **Console Errors**

```javascript
// Network error
"Failed to fetch"

// Apollo error
"ApolloError: [error details]"

// Type error
"Property 'user_profile' does not exist"
```

## 🎯 **Expected Resolution**

After debugging, the profile page should:

1. **Load user data** from GraphQL correctly
2. **Display all profile fields** with actual values
3. **Show accurate completion percentage** based on GraphQL data
4. **Synchronize data** between left and right cards
5. **Handle errors gracefully** with user-friendly messages

---

**Status**: 🔍 **Under Investigation**
**Priority**: **High** - Profile functionality broken
**Next Action**: Check browser console and run test scripts
