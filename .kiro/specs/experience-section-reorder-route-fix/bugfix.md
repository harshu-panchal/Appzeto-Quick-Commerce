# Bugfix Requirements Document

## Introduction

This document specifies the requirements for fixing a 400 error that occurs when admin users attempt to reorder experience sections in the ContentManager component. The bug is caused by incorrect route ordering in the Express router configuration, where the generic route `PUT /admin/experience/:id` is defined before the specific route `PUT /admin/experience/reorder`. This causes Express to incorrectly match the reorder endpoint, treating "reorder" as an ID parameter instead of routing to the dedicated reorder handler.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN an admin user clicks the up/down arrow buttons to reorder experience sections THEN the system returns a 400 status code error and the sections are not reordered

1.2 WHEN a PUT request is made to `/admin/experience/reorder` THEN Express matches it to the `/admin/experience/:id` route instead of the dedicated reorder route

1.3 WHEN the generic update controller receives "reorder" as an ID parameter THEN it attempts to find a MongoDB document with `id = "reorder"`, which fails validation and returns a 400 error

### Expected Behavior (Correct)

2.1 WHEN an admin user clicks the up/down arrow buttons to reorder experience sections THEN the system SHALL successfully reorder the sections without errors

2.2 WHEN a PUT request is made to `/admin/experience/reorder` THEN Express SHALL route it to the dedicated reorder handler, not the generic update handler

2.3 WHEN the reorder endpoint is invoked THEN the system SHALL process the reorder request with the appropriate controller function

### Unchanged Behavior (Regression Prevention)

3.1 WHEN an admin user updates an experience section by ID using `PUT /admin/experience/:id` with a valid MongoDB ObjectId THEN the system SHALL CONTINUE TO update the section successfully

3.2 WHEN any other experience-related API endpoints are called THEN the system SHALL CONTINUE TO function as expected

3.3 WHEN the reorder controller processes valid reorder data THEN the system SHALL CONTINUE TO reorder sections using the existing controller logic
