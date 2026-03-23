// Local storage initialization
if (!localStorage.getItem("votes")) localStorage.setItem("votes", JSON.stringify({ A:0, B:0, C:0 }));
if (!localStorage.getItem("users")) localStorage.setItem("users", JSON.stringify([]));

// Election Officer default credentials (optional pre-created)
const defaultOfficer = { username: "officer", password: "admin", role: "officer" };
let users = JSON.parse(localStorage.getItem("users"));
if(!users.find(u=>u.username === defaultOfficer.username)) {
  users.push(defaultOfficer);
  localStorage.setItem("users", JSON.stringify(users));
}

// Elector Login
if(document.getElementById("electorLoginForm")){
  document.getElementById("electorLoginForm").addEventListener("submit", function(e){
    e.preventDefault();
    let user = document.getElementById("electorUsername").value;
    let pass = document.getElementById("electorPassword").value;
    let users = JSON.parse(localStorage.getItem("users"));
    const foundUser = users.find(u => u.username === user && u.password === pass && u.role === "elector");
    if(foundUser){
      localStorage.setItem("role","elector");
      localStorage.setItem("currentUser", user);
      window.location.href="voting.html";
    } else alert("Elector login failed! Please signup first.");
  });
}

// Elector Signup
if(document.getElementById("electorSignupForm")){
  document.getElementById("electorSignupForm").addEventListener("submit", function(e){
    e.preventDefault();
    let user = document.getElementById("newElectorUsername").value;
    let pass = document.getElementById("newElectorPassword").value;
    let users = JSON.parse(localStorage.getItem("users"));
    if(users.find(u=>u.username===user)){
      alert("Username already exists!");
      return;
    }
    users.push({username:user,password:pass,role:"elector"});
    localStorage.setItem("users", JSON.stringify(users));
    alert("Elector signup successful! Now login.");
  });
}

// Officer Login
if(document.getElementById("officerLoginForm")){
  document.getElementById("officerLoginForm").addEventListener("submit", function(e){
    e.preventDefault();
    let user = document.getElementById("officerUsername").value;
    let pass = document.getElementById("officerPassword").value;
    let users = JSON.parse(localStorage.getItem("users"));
    const foundUser = users.find(u => u.username === user && u.password === pass && u.role === "officer");
    if(foundUser){
      localStorage.setItem("role","officer");
      localStorage.setItem("currentUser", user);
      window.location.href="results.html";
    } else alert("Invalid Officer credentials!");
  });
}

// Officer Signup
if(document.getElementById("officerSignupForm")){
  document.getElementById("officerSignupForm").addEventListener("submit", function(e){
    e.preventDefault();
    let user = document.getElementById("newOfficerUsername").value;
    let pass = document.getElementById("newOfficerPassword").value;
    let users = JSON.parse(localStorage.getItem("users"));
    if(users.find(u=>u.username===user)){
      alert("Username already exists!");
      return;
    }
    users.push({username:user,password:pass,role:"officer"});
    localStorage.setItem("users", JSON.stringify(users));
    alert("Officer signup successful! Now login.");
  });
}

// Voting logic
// Voting logic: track per elector
function castVote(candidate){
  let currentUser = localStorage.getItem("currentUser");
  if(!currentUser){
    alert("Please login first!");
    return;
  }

  // Get votes tracking per user
  let userVotes = JSON.parse(localStorage.getItem("userVotes")) || {};

  if(userVotes[currentUser]){
    alert("You have already voted!");
    return;
  }

  // Increment candidate votes
  let votes = JSON.parse(localStorage.getItem("votes"));
  votes[candidate]++;
  localStorage.setItem("votes", JSON.stringify(votes));

  // Mark this user as voted
  userVotes[currentUser] = true;
  localStorage.setItem("userVotes", JSON.stringify(userVotes));

  // Thank you message
  document.getElementById("thankYou").innerHTML = "🎉 Thank you for voting!";
  document.querySelectorAll(".vote-btn").forEach(btn => btn.disabled = true);
}


// Results logic
if(document.getElementById("results")){
  if(localStorage.getItem("role") !== "officer"){
    alert("Only Election Officer can view results!");
    window.location.href = "login.html";
  } else {
    let votes = JSON.parse(localStorage.getItem("votes"));
    let maxVotes = Math.max(...Object.values(votes));
    let resultsDiv = document.getElementById("results");
    for(let candidate in votes){
      let div = document.createElement("div");
      div.classList.add("result-card");
      if(votes[candidate] === maxVotes && maxVotes>0) div.classList.add("winner");
      div.innerHTML = `<h3>Candidate ${candidate}</h3><p>Votes: ${votes[candidate]}</p>`;
      resultsDiv.appendChild(div);
    }
  }
}
