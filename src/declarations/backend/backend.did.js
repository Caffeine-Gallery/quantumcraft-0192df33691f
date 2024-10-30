export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'getCurrentWebsite' : IDL.Func([], [IDL.Text], ['query']),
    'getPublishedWebsites' : IDL.Func([], [IDL.Vec(IDL.Text)], ['query']),
    'publishWebsite' : IDL.Func([], [Result_1], []),
    'saveWebsite' : IDL.Func([IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
