module.exports = {
  const headers = [
    {
      headerTitle: 'name',
      required: false,
    },
    {
      headerTitle: 'email',
      required: true,
    }
  ];

  const mismatchWithoutHeadersCSV = 'bob@email.com,Bob,
    joe@@invalid,Joe,
    ,Storm,
    invalidEmail,Pat,
    bat@cave.com,Bat Man,
    noName@who.com,,
    ryan@reynolds.com,Deadpool,Random';

  const mismatchWithHeadersCSV = 'csv email,name,
    bob@email.com,Bob,
    joe@@invalid,Joe,
    ,Storm,
    invalidEmail,Pat,
    bat@cave.com,Bat Man,
    noName@who.com,,
    ryan@reynolds.com,Deadpool,Random';

  const threeFailed4Pass = 'csv name,email,
    Bob,bob@email.com,
    Joe,joe@@invalid,
    Storm,,
    Pat,invalidEmail,
    Bat Man,bat@cave.com,
    ,noName@who.com,
    Deadpool,ryan@reynolds.com,Random';

  const threeFailed4PassResult =   {
      successfulRows: [
        {
          companyName: "Bob",
          email: "bob@email.com",
        },
        {
          companyName: "Bat Man",
          email: "bat@cave.com",
        },
        {
          companyName: '',
          email: "noName@who.com",
        },
        {
          companyName: "Deadpool",
          email: "ryan@reynolds.com",
        },
      ],
      failedRows: [
        {
          companyName: "Joe",
          email: "joe@@invalid",
          error: "Invalid email",
          line: 3,
        },
        {
          companyName: "Pat",
          email: "invalidEmail",
          error: "Invalid email",
          line: 5,
        },
        {
          companyName:"Storm",
          email: '',
          error: "Missing email",
          line: 4,
        },
      ],
    };
};
