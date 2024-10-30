export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'getPublishedWebsites' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'publishWebsite' : IDL.Func([], [IDL.Text], []),
    'saveWebsite' : IDL.Func([IDL.Text], [], []),
  });
};
export const init = ({ IDL }) => { return []; };
