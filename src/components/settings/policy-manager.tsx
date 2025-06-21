import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface PolicyManagerProps {
  form: UseFormReturn<any>;
}

export function PolicyManager({ form }: PolicyManagerProps) {
  const [newTitle, setNewTitle] = useState("");
  const [newPolicy, setNewPolicy] = useState("");
  const [activePolicyId, setActivePolicyId] = useState<string | null>(null);

  const policies = form.watch("custom_policies") || [];

  const addNewPolicyTitle = () => {
    if (!newTitle.trim()) return;

    const newPolicyGroup = {
      id: crypto.randomUUID(),
      title: newTitle,
      policies: [],
    };

    form.setValue("custom_policies", [...policies, newPolicyGroup]);
    setNewTitle("");
    setActivePolicyId(newPolicyGroup.id);
  };

  const addPolicyToTitle = (policyGroupId: string) => {
    if (!newPolicy.trim()) return;

    const updatedPolicies = policies.map((group: any) => {
      if (group.id === policyGroupId) {
        return {
          ...group,
          policies: [...group.policies, newPolicy],
        };
      }
      return group;
    });

    form.setValue("custom_policies", updatedPolicies);
    setNewPolicy("");
  };

  const removePolicy = (policyGroupId: string, policyIndex: number) => {
    const updatedPolicies = policies.map((group: any) => {
      if (group.id === policyGroupId) {
        const updatedPoliciesList = [...group.policies];
        updatedPoliciesList.splice(policyIndex, 1);
        return {
          ...group,
          policies: updatedPoliciesList,
        };
      }
      return group;
    });

    form.setValue(
      "custom_policies",
      updatedPolicies.filter((group: any) => group.policies.length > 0)
    );
  };

  const removePolicyGroup = (policyGroupId: string) => {
    form.setValue(
      "custom_policies",
      policies.filter((group: any) => group.id !== policyGroupId)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Input
            placeholder="Enter policy title (e.g., Refund Policy)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addNewPolicyTitle}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Title
        </Button>
      </div>

      {policies.map((policyGroup: CustomPolicy, policyIndex: number) => (
        <div key={policyGroup.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{policyGroup.title}</h4>
              {form.formState.errors.custom_policies &&
                Array.isArray(form.formState.errors.custom_policies) &&
                form.formState.errors.custom_policies[policyIndex]?.title && (
                  <span className="text-red-500 text-xs">
                    {form.formState.errors.custom_policies[
                      policyIndex
                    ]?.title?.message?.toString()}
                  </span>
                )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removePolicyGroup(policyGroup.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {activePolicyId === policyGroup.id && (
            <div className="flex gap-2">
              <Textarea
                placeholder="Enter policy details"
                value={newPolicy}
                onChange={(e) => setNewPolicy(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addPolicyToTitle(policyGroup.id)}
              >
                Add
              </Button>
            </div>
          )}

          <ul className="space-y-2">
            {policyGroup.policies.map((policy: string, index: number) => (
              <li key={index} className="flex items-center justify-between">
                <span className="text-sm">{policy}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePolicy(policyGroup.id, index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
          {form.formState.errors.custom_policies &&
            Array.isArray(form.formState.errors.custom_policies) &&
            form.formState.errors.custom_policies[policyIndex]?.policies && (
              <span className="text-red-500 text-xs">
                {form.formState.errors.custom_policies[
                  policyIndex
                ]?.policies?.message?.toString()}
              </span>
            )}

          {activePolicyId !== policyGroup.id && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setActivePolicyId(policyGroup.id)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Policy
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
