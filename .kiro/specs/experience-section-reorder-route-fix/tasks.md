# Implementation Plan

- [ ] 1. Write bug condition exploration test
  - **Property 1: Fault Condition** - Reorder Endpoint Routes to Wrong Controller
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases: PUT requests to `/admin/experience/reorder` with valid reorder payloads
  - Test that PUT `/admin/experience/reorder` with `{ items: [{id: "validId1", order: 0}, {id: "validId2", order: 1}] }` routes to `reorderExperienceSections` controller (not `updateExperienceSection`)
  - Test that the response is NOT a 400 error with MongoDB ObjectId validation failure for "reorder" string
  - Test that the request params do NOT contain `req.params.id = "reorder"`
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found: requests return 400, route to wrong controller, "reorder" treated as ObjectId
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - All Other Experience Routes Continue to Work
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (all routes except PUT `/admin/experience/reorder`)
  - Observe: PUT `/admin/experience/:id` with valid ObjectId routes to `updateExperienceSection`
  - Observe: GET `/admin/experience` routes to `getAdminExperienceSections`
  - Observe: POST `/admin/experience` routes to `createExperienceSection`
  - Observe: DELETE `/admin/experience/:id` routes to `deleteExperienceSection`
  - Observe: POST `/admin/experience/upload-banner` routes to `uploadBannerImage`
  - Observe: GET `/experience` routes to `getPublicExperienceSections`
  - Write property-based tests capturing observed routing behavior for all non-reorder endpoints
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 3. Fix route ordering in experienceRoutes.js

  - [ ] 3.1 Reorder route definitions
    - Move `PUT /admin/experience/reorder` route definition to appear BEFORE `PUT /admin/experience/:id` route definition
    - Ensure the moved route retains its middleware chain: `verifyToken`, `allowRoles("admin")`, and `reorderExperienceSections`
    - Preserve all other route definitions in their current positions
    - Recommended order: GET list, POST create, PUT reorder (specific), PUT :id (generic), DELETE :id, POST upload-banner, GET public
    - _Bug_Condition: isBugCondition(request) where request.method == 'PUT' AND request.path == '/admin/experience/reorder' AND routeDefinitionOrder(PUT /admin/experience/:id) < routeDefinitionOrder(PUT /admin/experience/reorder)_
    - _Expected_Behavior: expressRouter_fixed(request).controller == reorderExperienceSections for all requests to PUT /admin/experience/reorder_
    - _Preservation: All other experience routes (GET, POST, PUT /:id, DELETE /:id, POST /upload-banner, GET /experience) must continue to route to the same controllers as before_
    - _Requirements: 2.1, 2.2, 2.3, 3.1, 3.2, 3.3_

  - [ ] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Reorder Endpoint Routes Correctly
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - All Other Routes Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.1, 3.2, 3.3_

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
