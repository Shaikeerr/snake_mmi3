import { useEffect } from "react";
import { useState } from "react";
import useStore from "../../utils/store";
import s from "./Submit.module.scss";

const Submit = ({ score, death, setHasEnteredResults }) => {
  const [name, setName] = useState("");
  const { setResults } = useStore();

  useEffect(() => {
    let results = localStorage.getItem("results");
    results = JSON.parse(results);

    if (results) {
      setResults(results);
    }
  }, []);

  const onSubmit = (e) => {
    //empêcher la page de reload
    e.preventDefault();

    let results = localStorage.getItem("results");
    results = JSON.parse(results);

    if (results === null) {
      // jamais personne qui a push son score
      results = [
        {
          name: name,
          score: score,
          death: death,
        },
      ];
      setResults(results);
      localStorage.setItem("results", JSON.stringify(results));
    } else {
      results.push({
        name: name,
        score: score,
        death: death,
      });

      localStorage.setItem("results", JSON.stringify(results));
      setResults(results);
    }

    setHasEnteredResults(true);
  };

  return (
    <form className={s.form} onSubmit={onSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
    </form>
  );
};

export default Submit;
