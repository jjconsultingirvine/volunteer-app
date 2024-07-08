import React from "react";
import { Organization, User } from "../schema";
import { SupabaseClient } from "@supabase/supabase-js";
import TopNavBar from "../components/top_nav_bar";
import OrgListing from "../components/org_listing";
import { useSearchParams } from "react-router-dom";
import "../style/search.css";

interface Props {
  supabase: SupabaseClient<any, "public", any>;
  clerk_session: any;
  user: User | null;
  orgs: Organization[];
  setUser: (usr: User) => void;
}

// prettier-ignore
const IGNORED_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that",
  "have", "I", "it", "for", "not", "on", "with", "he",
  "as", "you", "do", "at", "this", "but", "his", "by",
  "from", "they", "we", "say", "her", "she", "or", "will",
  "an", "my", "one", "all", "would", "there", "their", "what",
];
const PRIORITY_MAPPING: [string, number][] = [
  ["address", 1],
  ["short_desc", 3],
  ["long_desc", 2],
  ["name", 10],
  ["roles", 2],
  ["interest", 1],
  ["keywords", 8],
];

const Search: React.FC<Props> = (props: Props) => {
  const toggle_save = (name: string) => {
    if (!props.user) return;
    let new_saved = props.user.saved.slice();
    if (new_saved.includes(name)) {
      new_saved.splice(new_saved.indexOf(name), 1);
    } else {
      new_saved.push(name);
    }
    props.setUser({ ...props.user, saved: new_saved });
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const query_words = query
    .split(" ")
    .filter((word) => !IGNORED_WORDS.includes(word));
  const results = props.orgs
    .map((org) => {
      let priority = 0;
      PRIORITY_MAPPING.forEach(([name, pri]) => {
        if (!(org as any)[name]) return;
        const member: string = JSON.stringify((org as any)[name]).toLowerCase();
        query_words.forEach((word) => {
          // Match word fragments
          for (let _ in member.match(RegExp(word.toLowerCase(), "g"))) {
            priority += pri;
          }
          // Match whole words
          for (let _ in member.match(
            RegExp("[^a-zA-Z\\d]" + word.toLowerCase() + "[^a-zA-Z\\d]", "g")
          )) {
            priority += pri;
          }
        });
      });
      return { org, priority };
    })
    .filter((entry) => entry.priority > 0)
    .sort((entry) => entry.priority);
  return (
    <>
      <TopNavBar title="Search" user={props.user}></TopNavBar>
      <div className="page">
        <div className="orgs_list">
          <input
            type="text"
            className="search_bar"
            value={query}
            onChange={(e) =>
              setSearchParams({ query: e.target.value }, { replace: true })
            }
          ></input>
        </div>
        <div className="orgs_list">
          {results.length == 0 && <strong>No results found.</strong>}
          {results.length != 0 && query.length < 3 && <strong>Query too short.</strong>}
          {results.length != 0 &&
            query.length >= 3 &&
            results.map(({ org }) => {
              return (
                <OrgListing
                  key={org.url_name}
                  org={org}
                  save_callback={toggle_save}
                  saved={props.user?.saved.includes(org.url_name) || false}
                ></OrgListing>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Search;
