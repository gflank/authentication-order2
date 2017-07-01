const OrganizationController = require('../controllers/organization');
const express = require('express');
const passport = require('passport');

const passportService = require('../config/passport');
const requireAuth = passport.authenticate('jwt', { session: false });

const organizationRoutes = express.Router();

organizationRoutes.get('/', requireAuth, OrganizationController.queryOrganizations);

organizationRoutes.get('/:organizationId', requireAuth, OrganizationController.getOrganization);

organizationRoutes.post('/new', requireAuth, OrganizationController.createOrganization);

organizationRoutes.post('/:organizationId', requireAuth, OrganizationController.updateOrganization);

module.exports = organizationRoutes; 
