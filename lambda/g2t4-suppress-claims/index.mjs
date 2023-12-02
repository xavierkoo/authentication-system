const handler = async (event) => {
  event.response = {
    claimsOverrideDetails: {
      claimsToAddOrOverride: {
      },
      claimsToSuppress: ["birthdate", "family_name", "given_name", "email"],
    },
  };

  return event;
};

export { handler };