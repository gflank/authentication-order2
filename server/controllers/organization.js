const Organization = require('../models/organization');
const generateQuery = require('../helpers').generateQuery;

//= =======================================
// Organization Routes
//= =======================================
exports.createOrganization = function (req, res, next) {
  if (req.user._id.toString() !== req.body.owner) {
    return res.status(401).json({ error: 'You are not authorized to add this organization.' });
  }

  const organization = new Organization({
    name: req.body.name,
    description: req.body.description,
    owner: req.body.owner
  });
  if (req.body.parent_org != undefined) {
    organization.parent_org = req.body.parent_org;
  }

  organization.save((err, newOrganization) => {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    return res.status(200).json({ organization: newOrganization._id });
  });
};

exports.updateOrganization = function (req, res, next) {
  const organizationId = req.params.organizationId;

  Organization.findById(organizationId, (err, organization) => {
    if (err) {
      res.status(400).json({ error: 'No organization could be found for this ID.' });
      return next(err);
    }
    if (req.user._id !== organization.owner) {
      return res.status(401).json({ error: 'You are not authorized to update this organization.' });
    }

    for (var field in organization) {
      if (req.body[field] != undefined) {
        organization[field] = req.body[field];
      }
    }

    organization.save((err, updatedOrganization) => {
      if (err) {
        return next(err);
      }

      return res.status(200).json({ organization: updatedOrganization._id });
    });
  });
};

exports.getOrganization = function (req, res, next) {
  const organizationId = req.params.organizationId;

  Organization.findById(organizationId, (err, organization) => {
    if (err) {
      res.send({ error: err });
      return next(err);
    }

    if (req.user._id.toString() !== organization.owner.toString()) {
      return res.status(401).json({ error: 'You are not authorized to view this organization.' });
    }

    return res.status(200).json({ organization: organization });
  });
};

exports.queryOrganizations = function (req, res, next) {
  var query = Organization.find();
  query.where('owner').equals(req.user._id.toString());
  generateQuery(query, req);
  query.select('_id');

  query.exec((err, organizationIds) => {
    if (err) {
      return next(err);
    }

    return res.status(200).json({ organizations: organizationIds});
  });
};
