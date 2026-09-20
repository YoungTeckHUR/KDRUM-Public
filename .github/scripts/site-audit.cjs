// Audit the approved selected-content layout; historical grid geometry is no longer the UI contract.
require('./workspace-audit.cjs').run('navigation').catch(error=>{console.error(error);process.exitCode=1;});
