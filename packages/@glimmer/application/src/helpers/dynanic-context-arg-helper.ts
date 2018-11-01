import {
  Opaque
} from '@glimmer/util';

import {
  TagWrapper,
  RevisionTag,
  PathReference,
  combine
} from "@glimmer/reference";

import {
  Arguments,
  Helper as GlimmerHelper,
  CapturedArguments,
  VM
} from "@glimmer/runtime";

import {
  CachedReference
} from '@glimmer/component';

class DynamicContextArgHelper extends CachedReference<Opaque> {
  public tag: TagWrapper<RevisionTag>;
  private args: CapturedArguments;
  private scopeRef: PathReference<Opaque>;

  constructor(private helper: any, args: Arguments, scopeRef: PathReference<Opaque>) {
    super();

    this.tag = combine([args.tag, scopeRef.tag]);
    this.args = args.capture();
    this.scopeRef = scopeRef;
  }

  compute() {
    let { helper, args, scopeRef } = this;

    return helper(args.positional.value(), args.named.value(), scopeRef.value());
  }
}

export default function getDynamicContextArgHelperFactory(helper, scopeKey): GlimmerHelper {
  return function (_vm: VM, args: Arguments) {
    let scope = _vm.dynamicScope();
    let scopeRef = scope.get(scopeKey);
    return new DynamicContextArgHelper(helper, args, scopeRef);
  };
}
