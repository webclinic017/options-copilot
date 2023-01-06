import { useMutation, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/utils/supabaseClient";

const addTradeTags = async ({ name, tag_type }, user_id) => {
  const { data: tags, error: err } = await supabase
    .from("trade_tags")
    .insert({ name, tag_type, user_id });

  if (err) {
    console.log("err", err);
    throw err;
  }

  return tags;
};

export const useAddTradeTags = () => {
  const queryClient = useQueryClient();
  const user = supabase.auth.user();
  return useMutation(
    (data: { name: string; tag_type: string }) => addTradeTags(data, user.id),
    {
      onSuccess: () => {
        return queryClient.refetchQueries(["tradeTags"]);
      },
    }
  );
};
